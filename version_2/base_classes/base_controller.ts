import { reactive, ref, isRef, computed, watch, onMounted, onBeforeUnmount, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import LoggerUtil from "../utils/logger_util";
import { ComponentDefinitionInterface } from "../types/component_type";

class BaseController {
    public readonly name: string;
    public component_name: string;
    protected logger: LoggerUtil;

    public props: Record<string, any> = {};
    public components: Record<string, any> = {};
    public computed_refs: Record<string, any> = {};
    public state_refs: Record<string, any> = {};

    constructor(component_name: string, props: Record<string, any> = {}) {
        this.component_name = component_name;
        this.name = `${component_name}_controller`;

        this.props = props;
        this.logger = new LoggerUtil({ prefix: this.name, show_timestamp: false });
    }

    // Method to get ui components
    protected getUIComponents(): Record<string, any> {
        return {};
    }

    // Method to to get ui computed data
    protected getUIComputedData(): Record<string, () => any> {
        return {};
    }

    // Method to get ui watchers
    protected getUIWatchers(): Record<string, (new_val: any, old_val: any) => void> {
        return {};
    }

    // Method to get ui state data
    protected getUIStateData(): Record<string, any> {
        return {};
    }

    // Default lifecycle methods (can be overridden in child class)
    protected async handleOnCreatedLogic(): Promise<void> {
        this.logger.log(`[Created] Component ${this.name} has been created`);
    }

    protected async handleOnMountedLogic(): Promise<void> {
        this.logger.log(`[Mounted] Component ${this.name} has been mounted`);
    }

    protected async handleBeforeUnmountedLogic(): Promise<void> {
        this.logger.log(`[BeforeUnmount] Component ${this.name} will unmount`);
    }

    // Method to define component
    public getComponentDefinition(): ComponentDefinitionInterface {
        this.components = this.getUIComponents();

        // State
        // this.state_refs = this.getUIStateData();
        const raw_state = this.getUIStateData();
        this.state_refs = {} as Record<string, any>;

        Object.entries(raw_state).forEach(([key, value]) => {
            if (isRef(value)) {
                this.state_refs[key] = value;
            } else if (typeof value === "object" && value !== null) {
                this.state_refs[key] = reactive(value);
            } else {
                this.state_refs[key] = ref(value);
            }
        });

        // Computed
        const computed_data = this.getUIComputedData();
        Object.entries(computed_data).forEach(([key, getter]) => {
            // Check if the getter is async
            if (getter.constructor.name === "AsyncFunction") {
                // Async: store a ref and call getter to update it
                const valueRef = ref<any>(null);
                watchEffect(async () => {
                    valueRef.value = await getter();
                });
                this.computed_refs[key] = valueRef;
            } else {
                // Sync: store computed
                this.computed_refs[key] = computed(getter);
            }
        });

        // Watchers
        const watchers = this.getUIWatchers();
        Object.entries(watchers).forEach(([key, fn]) => {
            let source: any = this.state_refs[key] || this.props[key];

            // special case for globals like route
            if (!source) {
                if (key === "route") {
                    source = useRoute();
                } else if (key === "router") {
                    source = useRouter();
                }
            }

            if (source) {
                // Always wrap source in a getter so Vue tracks reactivity correctly
                watch(() => (isRef(source) ? source.value : source), fn, { deep: true });
            }
        });

        this.handleOnCreatedLogic().catch((error) => {
            this.logger.error(`[Created] Component ${this.name} failed during created logic`, error);
        });

        onMounted(async () => {
            await this.handleOnMountedLogic();
        });

        onBeforeUnmount(async () => {
            await this.handleBeforeUnmountedLogic();
        });

        return {
            props: this.props,
            state_refs: this.state_refs,
            components: this.components,
            computed_refs: this.computed_refs
        };
    }
}

export default BaseController;

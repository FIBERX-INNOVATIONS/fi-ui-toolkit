import {
    reactive,
    ref,
    isRef,
    computed,
    watch,
    onMounted,
    onBeforeUnmount,
    watchEffect,
} from "vue";

import { EventBusType } from "../utils/event_bus_util";

import { Router, useRoute, useRouter } from "vue-router";

import LoggerUtil from "../utils/logger_util";

import { ComponentDefinitionInterface } from "../types/component_type";

import {
    ComputedGetterType,
    StateRefsType,
    ComputedRefsType,
    WatchersType,
    ComputedDefinitionType
} from "../types/base_type";




/* -------------------------------------------------- */
/* Base Controller                                    */
/* -------------------------------------------------- */

class BaseController<
    Props extends Record<string, any> = {},
    State extends Record<string, any> = {},
    Computed extends Record<string, any> = {},
    Components extends Record<string, any> = {},
    Events extends Record<string, any> = {}
> {

    public readonly name: string;

    public component_name: string;

    protected logger: LoggerUtil;

    public readonly router: Router = useRouter();

    public readonly route = useRoute();

    public readonly event_bus: EventBusType<Events> | null;

    public props: Props;

    public components: Components = {} as Components;

    public state_refs: StateRefsType<State> = {} as StateRefsType<State>;

    public computed_refs: ComputedRefsType<Computed> = {} as ComputedRefsType<Computed>;


    constructor(
        component_name: string, 
        props: Props,
        event_bus?: EventBusType<Events>
    ) {

        this.component_name = component_name;
        this.name = `${component_name}_controller`;

        this.props = props;

        this.event_bus = event_bus ?? null;

        this.logger = new LoggerUtil({
            prefix: this.name,
            show_timestamp: false
        });
    }


    /* -------------------------------------------------- */
    /* OVERRIDABLE METHODS                                */
    /* -------------------------------------------------- */

    protected getUIComponents(): Components {
        return {} as Components;
    }

    protected getUIStateData(): State {
        return {} as State;
    }

    protected getUIComputedData(): ComputedDefinitionType<Computed> {
        return {} as ComputedDefinitionType<Computed>;
    }

    protected getUIWatchers(): WatchersType<Props, State> {
        return {};
    }


    /* -------------------------------------------------- */
    /* LIFECYCLE METHODS                                  */
    /* -------------------------------------------------- */

    protected async handleOnCreatedLogic(): Promise<void> {
        this.logger.log(`[Created] Component ${this.name} created`);
    }

    protected async handleOnMountedLogic(): Promise<void> {
        this.logger.log(`[Mounted] Component ${this.name} mounted`);
    }

    protected async handleBeforeUnmountedLogic(): Promise<void> {
        this.logger.log(`[BeforeUnmount] Component ${this.name} will unmount`);
    }


    /* -------------------------------------------------- */
    /* COMPONENT FACTORY                                  */
    /* -------------------------------------------------- */

    public getComponentDefinition(): ComponentDefinitionInterface {

        this.components = this.getUIComponents();

        const raw_state = this.getUIStateData();


        /* ----------------------------- */
        /* State                         */
        /* ----------------------------- */

        Object.entries(raw_state).forEach(([key, value]) => {

            if (isRef(value)) {

                (this.state_refs as any)[key] = value;

            }

            else if (typeof value === "object" && value !== null) {

                (this.state_refs as any)[key] = ref(reactive(value));

            }

            else {

                (this.state_refs as any)[key] = ref(value);

            }

        });


        /* ----------------------------- */
        /* Computed                      */
        /* ----------------------------- */

        const computed_data = this.getUIComputedData();

        Object.entries(computed_data).forEach(([key, getter]) => {

            if (getter.constructor.name === "AsyncFunction") {

                const valueRef = ref<any>(null);

                watchEffect(async () => {
                    valueRef.value = await getter();
                });

                (this.computed_refs as any)[key] = valueRef;

            }

            else {

                (this.computed_refs as any)[key] = computed(getter);

            }

        });


        /* ----------------------------- */
        /* WatchersType                      */
        /* ----------------------------- */

       const watchers = this.getUIWatchers();

        Object.entries(watchers).forEach(([key, fn]) => {

            let source: any;

            if ((this.state_refs as any)[key]) {

                source = (this.state_refs as any)[key];

            } 
            else if (key in this.props) {

                source = () => (this.props as any)[key];

            }

            if (!source) {

                if (key === "route") source = this.route;
                if (key === "router") source = this.router;

            }

            if (!source) {

                this.logger.warn(`Watcher source "${key}" not found`);
                return;

            }

            watch(source as any, fn as any, { deep: true });

        });


        /* ----------------------------- */
        /* Lifecycle                     */
        /* ----------------------------- */

        this.handleOnCreatedLogic();

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
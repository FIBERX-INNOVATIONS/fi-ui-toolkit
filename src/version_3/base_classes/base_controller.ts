import {
    ref,
    isRef,
    computed,
    watch,
    onMounted,
    onBeforeUnmount,
    watchEffect,
    Ref,
    WatchStopHandle,
    WatchCallback,
    WatchOptions,
    WatchSource
} from "vue";

import { EventBusType } from "../utils/event_bus_util";

import { Router, useRoute, useRouter } from "vue-router";

import LoggerUtil from "../utils/logger_util";

import { ComponentDefinitionInterface } from "../types/component_type";

import {
    StateRefsType,
    ComputedRefsType,
    WatchersType,
    ComputedDefinitionType,
    WatcherDefinitionType,
    WatcherHandlerType
} from "../types/base_type";

import type BaseActionHandler from "./base_action_handler";

/* -------------------------------------------------- */
/* Base Controller                                    */
/* -------------------------------------------------- */

class BaseController<
    Props extends object = object,
    State extends object = object,
    Computed extends object = object,
    Components extends object = object,
    Events extends object = object
> {
    public readonly name: string;

    public component_name: string;

    protected logger: LoggerUtil;

    public readonly router: Router = useRouter();

    public readonly route = useRoute();

    public readonly event_bus: EventBusType<Events> | null;

    public action_handler?: BaseActionHandler<Props, State, Computed, Components, Events> | null;

    public props: Props;

    public components: Components = {} as Components;

    public state_refs: StateRefsType<State> = {} as StateRefsType<State>;

    public computed_refs: ComputedRefsType<Computed> = {} as ComputedRefsType<Computed>;

    private is_initialized: boolean = false;

    private watcher_stop_handles: WatchStopHandle[] = [];

    constructor(
        component_name: string,
        props: Props,
        event_bus?: EventBusType<Events>,
        action_handler?: BaseActionHandler<Props, State, Computed, Components, Events>
    ) {
        this.component_name = component_name;
        this.name = `${component_name}_controller`;

        this.props = props;

        this.event_bus = event_bus ?? null;

        this.action_handler = action_handler ?? null;

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

    public setActionHandler(handler: BaseActionHandler<Props, State, Computed, Components, Events>): void {
        this.action_handler = handler;
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
    /* INTERNAL HELPERS                                   */
    /* -------------------------------------------------- */

    private createStateRef<TValue>(value: TValue | Ref<TValue>): Ref<TValue> {
        return isRef(value) ? value : (ref(value) as Ref<TValue>);
    }

    private isAsyncGetter(getter: () => unknown): boolean {
        return getter.constructor.name === "AsyncFunction";
    }

    private normalizeWatcherConfig(watcher_definition: WatcherDefinitionType): {
        handler: WatcherHandlerType;
        options: WatchOptions;
    } {
        if (typeof watcher_definition === "function") {
            return {
                handler: watcher_definition,
                options: { deep: true }
            };
        }

        return {
            handler: watcher_definition.handler,
            options: {
                deep: true,
                ...(watcher_definition.options ?? {})
            }
        };
    }

    private resolveWatcherSource(key: string): WatchSource<unknown> | null {
        if (key in this.state_refs) {
            const state_key = key as keyof State;

            return () => this.state_refs[state_key].value;
        }

        if (key in this.props) {
            const props_key = key as keyof Props;

            return () => this.props[props_key];
        }

        if (key === "route") {
            return () => this.route;
        }

        if (key === "router") {
            return () => this.router;
        }

        return null;
    }

    private async runLifecycleHook(hook_name: string, callback: () => Promise<void>): Promise<void> {
        try {
            await callback();
        } catch (error) {
            this.logger.error(`[${hook_name}] Component ${this.name} lifecycle error`, error);
        }
    }

    /* -------------------------------------------------- */
    /* COMPONENT FACTORY                                  */
    /* -------------------------------------------------- */

    public getComponentDefinition(): ComponentDefinitionInterface<Props, State, Computed, Components> {
        if (this.is_initialized) {
            return {
                props: this.props,
                state_refs: this.state_refs,
                components: this.components,
                computed_refs: this.computed_refs
            };
        }

        this.components = this.getUIComponents();

        const raw_state = this.getUIStateData();

        /* ----------------------------- */
        /* State                         */
        /* ----------------------------- */

        (Object.keys(raw_state) as Array<keyof State>).forEach((key) => {
            this.state_refs[key] = this.createStateRef(raw_state[key]);
        });

        /* ----------------------------- */
        /* Computed                      */
        /* ----------------------------- */

        const computed_data = this.getUIComputedData();

        (Object.keys(computed_data) as Array<keyof Computed>).forEach((key) => {
            const getter = computed_data[key];

            if (this.isAsyncGetter(getter)) {
                const valueRef = ref<Computed[typeof key] | null>(null);

                let run_id = 0;

                watchEffect(async () => {
                    const current_run_id = ++run_id;

                    try {
                        const value = await getter();

                        if (current_run_id === run_id) {
                            valueRef.value = value;
                        }
                    } catch (error) {
                        this.logger.error(`Computed getter "${String(key)}" failed`, error);
                    }
                });

                this.computed_refs[key] = valueRef as unknown as ComputedRefsType<Computed>[typeof key];
            } else {
                this.computed_refs[key] = computed(getter) as ComputedRefsType<Computed>[typeof key];
            }
        });

        /* ----------------------------- */
        /* Watchers                      */
        /* ----------------------------- */

        const watchers = this.getUIWatchers();

        (Object.keys(watchers) as Array<keyof WatchersType<Props, State>>).forEach((key) => {
            const watcher_definition = watchers[key];

            if (!watcher_definition) {
                return;
            }

            const source = this.resolveWatcherSource(String(key));

            if (!source) {
                this.logger.warn(`Watcher source "${String(key)}" not found`);
                return;
            }

            const { handler, options } = this.normalizeWatcherConfig(
                watcher_definition as unknown as WatcherDefinitionType<unknown>
            );

            const stop_handle = watch(source, handler as WatchCallback<unknown>, options);

            this.watcher_stop_handles.push(stop_handle);
        });

        /* ----------------------------- */
        /* Lifecycle                     */
        /* ----------------------------- */

        void this.runLifecycleHook("Created", () => this.handleOnCreatedLogic());

        onMounted(async () => {
            await this.runLifecycleHook("Mounted", () => this.handleOnMountedLogic());
        });

        onBeforeUnmount(async () => {
            this.watcher_stop_handles.forEach((stop) => stop());
            this.watcher_stop_handles = [];

            await this.runLifecycleHook("BeforeUnmount", () => this.handleBeforeUnmountedLogic());
        });

        this.is_initialized = true;

        return {
            props: this.props,
            state_refs: this.state_refs,
            components: this.components,
            computed_refs: this.computed_refs
        };
    }
}

export default BaseController;

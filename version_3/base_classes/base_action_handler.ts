import type BaseController from "./base_controller";

import LoggerUtil from "../utils/logger_util";

import {
    ActionLoadingOptionsInterface,
    ActionMethodType,
    ActionResultLikeInterface,
    OptionalActionResultType,
    StateKeyByValueType
} from "../types/base_type";

class BaseActionHandler<
    Props extends object = object,
    State extends object = object,
    Computed extends object = object,
    Components extends object = object,
    Events extends object = object
> {
    protected readonly logger: LoggerUtil;

    constructor(
        protected controller: BaseController<Props, State, Computed, Components, Events>,
        logger_prefix?: string
    ) {
        this.logger = new LoggerUtil({
            prefix: logger_prefix ?? `${controller.name}_action_handler`,
            show_timestamp: false
        });
    }

    protected get props(): Props {
        return this.controller.props;
    }

    protected get state_refs() {
        return this.controller.state_refs;
    }

    protected async invokeAction<Action extends ActionMethodType>(
        action: Action | undefined,
        ...args: Parameters<Action>
    ): Promise<Awaited<ReturnType<Action>> | undefined> {
        if (!action) {
            return undefined;
        }

        return (await action(...args)) as Awaited<ReturnType<Action>>;
    }

    protected setState<K extends keyof State>(key: K, value: State[K]): void {
        const state_red = this.controller.state_refs[key];

        if (!state_red) {
            this.logger.warn(`State ref "${String(key)}" not found`);
            return;
        }

        const current_value = state_red.value;

        const isObject = (v: unknown): v is Record<string, unknown> =>
            v !== null && typeof v === "object" && !Array.isArray(v);

        if (isObject(current_value) && isObject(value)) {
            state_red.value = {
                ...current_value,
                ...value
            } as State[K];
        } else {
            state_red.value = value;
        }
    }

    protected getState<K extends keyof State>(key: K): State[K] | undefined {
        return this.controller.state_refs[key]?.value;
    }

    protected setErrorMessage(
        status?: boolean,
        msg?: string,
        error_key: keyof State = "error_text" as keyof State
    ): void {
        this.setState(error_key, (!status && msg ? msg : null) as State[typeof error_key]);
    }

    protected setErrorFromResult(result?: OptionalActionResultType, error_key?: keyof State): void {
        if (!result) {
            this.setErrorMessage(true, undefined, error_key);
            return;
        }

        this.setErrorMessage(result?.status, result?.msg, error_key);
    }

    protected async runWithLoading<T>(
        loading_key: StateKeyByValueType<State, boolean>,
        callback: () => Promise<T> | T,
        options: ActionLoadingOptionsInterface = {}
    ): Promise<T | undefined> {
        const loading_ref = this.controller.state_refs[loading_key];

        if (!loading_ref) {
            return await callback();
        }

        if (options.prevent_when_loading && loading_ref.value) {
            return undefined;
        }

        this.setState(loading_key, true as State[typeof loading_key]);

        try {
            return await callback();
        } finally {
            this.setState(loading_key, false as State[typeof loading_key]);
        }
    }

    protected logError(method_name: string, error: unknown): void {
        this.logger.error(`${method_name} error`, error);
    }
}

export default BaseActionHandler;

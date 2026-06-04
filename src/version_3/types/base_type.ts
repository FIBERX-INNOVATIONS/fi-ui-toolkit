import { Ref, WatchOptions } from "vue";
import { RouteLocationNormalizedLoaded, Router } from "vue-router";

import { AxiosRequestConfig } from "axios";
import { APIResponseInterface } from "./util_type";

/* -------------------------------------------------- */
/* Helper Types                                       */
/* -------------------------------------------------- */

export type ComputedGetterType<T> = () => T | Promise<T>;

export type ComputedDefinitionType<T> = {
    [K in keyof T]: ComputedGetterType<T[K]>;
};

export type StateRefsType<T> = {
    [K in keyof T]: Ref<T[K]>;
};

export type ComputedRefsType<T> = {
    [K in keyof T]: Ref<T[K]>;
};

export type ActionMethodType = (...args: never[]) => unknown;

export interface ActionResultLikeInterface {
    status?: boolean;

    msg?: string;
}

export type OptionalActionResultType = ActionResultLikeInterface | void | null | undefined;

export interface ActionLoadingOptionsInterface {
    prevent_when_loading?: boolean;
}

export type StateKeyByValueType<State, Value> = {
    [K in keyof State]-?: State[K] extends Value ? K : never;
}[keyof State];

export type WatcherValueType<Props, State, Key> = Key extends keyof Props
    ? Props[Key]
    : Key extends keyof State
      ? State[Key]
      : Key extends "route"
        ? RouteLocationNormalizedLoaded
        : Key extends "router"
          ? Router
          : unknown;

export type WatcherHandlerType<Value = unknown> = (new_val: Value, old_val: Value) => void;

export interface WatcherConfigInterface<Value = unknown> {
    handler: WatcherHandlerType<Value>;

    options?: WatchOptions;
}

export type WatcherDefinitionType<Value = unknown> = WatcherHandlerType<Value> | WatcherConfigInterface<Value>;

export type WatchersType<Props extends object, State extends object> = {
    [K in keyof Props | keyof State | "route" | "router"]?: WatcherDefinitionType<WatcherValueType<Props, State, K>>;
};

export interface BaseAPIServiceInterface {
    queryAPI<T = unknown>(config: AxiosRequestConfig): Promise<APIResponseInterface<T>>;
}

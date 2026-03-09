import {
    Ref
} from "vue";

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

export type WatchersType<Props, State> = {
    [K in keyof Props | keyof State | "route" | "router"]?:
        (new_val: any, old_val: any) => void;
};

export interface BaseAPIServiceInterface {
    queryAPI<T = any>(config: AxiosRequestConfig): Promise<APIResponseInterface<T>>;
}
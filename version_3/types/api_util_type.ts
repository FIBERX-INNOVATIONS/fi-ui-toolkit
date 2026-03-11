import { AxiosHeaders, AxiosResponse } from "axios";

export type RefreshTokenHandlerType = () => Promise<boolean>;

export type RefreshCSRFHandlerType = () => Promise<boolean>;

export interface APIClientConfigInterface {
    base_url: string;

    with_credentials?: boolean;

    request_timeout?: number;

    custom_headers?: Record<string, any> | AxiosHeaders
}

export interface APIResponseInterface<T = any> {
  status: string;
  msg: string;
  data?: T;
  full_response?: AxiosResponse;
}

import { AxiosRequestConfig } from "axios";

export interface APIRequestConfig extends AxiosRequestConfig {

    /** Prevent retry logic (401 refresh / 409 csrf) */
    disable_retry?: boolean;

    /** Internal retry flags */
    _retry?: boolean;

    _csrfRetry?: boolean;

}
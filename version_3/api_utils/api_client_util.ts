import axios, {
    AxiosInstance,
    AxiosHeaders,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig
} from "axios";

import { 
    APIRequestConfig,
    APIClientConfigInterface
} from "../types/api_util_type";

import LoggerUtil from "../utils/logger_util";

import RetryStrategyManager from "./retry_manager_util";


class APIClient {

    private static instance: APIClient;

    public axios_instance: AxiosInstance;

    private logger = new LoggerUtil({ prefix: "api_client" });

    private config: APIClientConfigInterface;

    private constructor(config: APIClientConfigInterface) {

        this.config = config;

        this.axios_instance = axios.create({
            baseURL: config.base_url,
            timeout: config.request_timeout ?? 100_000,
            withCredentials: config.with_credentials ?? true
        });

        this.attachInterceptors();

    }

    // Method to initialize api client
    public static init(config: APIClientConfigInterface) {

        if (!APIClient.instance) {
            APIClient.instance = new APIClient(config);
        }

        return APIClient.instance;

    }

    // Method to get initialized api client
    public static getInstance(): APIClient {

        if (!APIClient.instance) {
            throw new Error("APIClient not initialized");
        }

        return APIClient.instance;

    }

    /* ----------------------------- */
    private attachInterceptors() {
        this.axios_instance.interceptors.request.use(
            this.setCustomHeaders
        );

        this.axios_instance.interceptors.response.use(
            (response) => response,
            this.handleError
        );

    }

    // Method to Add headers (device ID, device name, token)
    private setCustomHeaders = async (
        config: InternalAxiosRequestConfig
    ): Promise<InternalAxiosRequestConfig> => {

        try {
            const custom_headers = this.config.custom_headers?.() || {};

            const headers =
                config.headers instanceof AxiosHeaders
                    ? config.headers
                    : new AxiosHeaders(config.headers);

            Object.entries(custom_headers).forEach(
                ([key, value]) => {
                    headers.set(key, value);
                }
            );

            config.headers = headers;

            return config;

        }
        catch (error) {

            this.logger.error(
                "Failed setting request headers",
                { error }
            );

            throw error;
        }

    };

    /* ----------------------------- */
    private handleError = async (error: any) => {

        const original_request = error.config as APIRequestConfig;

        const status = error?.response?.status;

        if (original_request?.disable_retry) {
            return Promise.reject(error);
        }

        /* ---------- 401 TOKEN REFRESH ---------- */

        if (status === 401 && !original_request._retry) {

            original_request._retry = true;

            const success =
                await RetryStrategyManager.tryRefreshToken();

            if (success) {
                return this.axios_instance(original_request);
            }

            return Promise.reject({
                status: "logout",
                msg: "session_expired"
            });

        }

        /* ---------- 409 CSRF REFRESH ---------- */

        if (status === 409 && !original_request._csrfRetry) {

            original_request._csrfRetry = true;

            const success =
                await RetryStrategyManager.tryRefreshCSRF();

            if (success) {
                return this.axios_instance(original_request);
            }

        }

        return Promise.reject(error);

    };

}

export default APIClient;
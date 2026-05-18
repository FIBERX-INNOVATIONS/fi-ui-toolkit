import LocalStorageManagerUtil from "./local_storage_manager_util";
import LoggerUtil from "./logger_util";
import GlobalVariableManagerUtil from "./global_variable_manager_util";
import { BaseAPIServiceInterface } from "../types/base_type";

class AuthTokenManagerUtil {
    public readonly name = "auth_token_manager_util";
    private static instance: AuthTokenManagerUtil;
    private api_service?: BaseAPIServiceInterface;
    private local_storage_manager: LocalStorageManagerUtil;
    private logger: LoggerUtil;
    private global_vars: GlobalVariableManagerUtil;

    private refresh_timer: ReturnType<typeof setTimeout> | null = null;
    private is_refreshing: boolean;
    private refresh_promise: Promise<string | null> | null = null;

    private ACCESS_TOKEN_KEY: string;
    private EXPIRES_AT_KEY: string;
    private REFRESH_MARGIN_MS: number;

    private constructor(api_service?: BaseAPIServiceInterface) {
        this.api_service = api_service;
        this.is_refreshing = false;
        this.ACCESS_TOKEN_KEY = "ACCESS_TOKEN_KEY";
        this.EXPIRES_AT_KEY = "ACCESS_TOKEN_EXPIRES_AT_KEY";
        this.REFRESH_MARGIN_MS = 60 * 1000; // refresh 1 minute before expiry
        this.local_storage_manager = new LocalStorageManagerUtil();
        this.logger = new LoggerUtil({ prefix: this.name, show_timestamp: false });
        this.global_vars = GlobalVariableManagerUtil.getInstance();
    }

    // Method to Schedule a refresh before token expires
    private scheduleRefreshIfNeeded(): void {
        if (this.refresh_timer) {
            clearTimeout(this.refresh_timer);
        }

        const access_token_key = this.global_vars.getVariable(this.ACCESS_TOKEN_KEY);
        const expires_in_key = this.global_vars.getVariable(this.EXPIRES_AT_KEY);

        if (!access_token_key || !expires_in_key) {
            return;
        }

        if (typeof expires_in_key !== "string") return;

        const expires_at = this.local_storage_manager.getData<number>(expires_in_key);
        // const expires_at = 100
        this.logger.log("Token expires at:", expires_at);

        if (!expires_at) {
            return;
        }

        const delay = expires_at - Date.now() - this.REFRESH_MARGIN_MS;
        this.logger.log(`Token refresh scheduled in ${(delay / 1000).toFixed(1)}s`);

        if (delay <= 0) {
            this.logger.log("Token already expired, refreshing immediately...");
            this.refreshAccessToken();
            return;
        }

        this.refresh_timer = setTimeout(async () => {
            await this.refreshAccessToken();
        }, delay);

        this.logger.log(`🔄 Token refresh scheduled in ${(delay / 1000).toFixed(1)}s`);
    }

    public static getInstance(api_service?: BaseAPIServiceInterface): AuthTokenManagerUtil {
        if (!this.instance) {
            this.instance = new AuthTokenManagerUtil(api_service);
        } else if (api_service) {
            this.instance.api_service = api_service;
            // ✅ Only now schedule refresh safely
            this.instance.scheduleRefreshIfNeeded();
        }

        return this.instance;
    }

    // Method to store access token
    public setToken(
        access_token_key: string,
        access_token: string,
        expires_in_key: string,
        expires_in_secs: number
    ): void {
        const expires_at_ms = Date.now() + expires_in_secs * 1000;

        this.local_storage_manager.setData(access_token_key, access_token);
        this.local_storage_manager.setData(expires_in_key, expires_at_ms);

        this.global_vars.updateVariable(this.ACCESS_TOKEN_KEY, access_token_key);
        this.global_vars.updateVariable(this.EXPIRES_AT_KEY, expires_in_key);

        this.logger.log("Access token saved and expiry set");
        this.scheduleRefreshIfNeeded();
    }

    // Method to Get stored access token (if valid)
    public async getValidAccessToken(): Promise<string | null> {
        const access_token_key = this.global_vars.getVariable(this.ACCESS_TOKEN_KEY);
        const expires_in_key = this.global_vars.getVariable(this.EXPIRES_AT_KEY);

        if (!access_token_key || !expires_in_key) {
            return null;
        }

        const access_token = this.local_storage_manager.getData<string>(access_token_key);
        const expires_at = this.local_storage_manager.getData<number>(expires_in_key);

        if (!access_token || !expires_at) return null;

        return access_token;
    }

    // Method to Refresh access token (singleton-safe)
    public async refreshAccessToken(): Promise<string | null> {
        this.logger.debug("Attempting to refresh access token...");
        if (this.is_refreshing && this.refresh_promise) {
            return this.refresh_promise;
        }

        const access_token_key = this.global_vars.getVariable(this.ACCESS_TOKEN_KEY);
        const expires_in_key = this.global_vars.getVariable(this.EXPIRES_AT_KEY);

        if (!access_token_key || !expires_in_key) {
            return null;
        }

        if (!this.api_service) {
            this.logger.error("No API service instance provided for token refresh.");
            return null;
        }

        this.is_refreshing = true;
        this.refresh_promise = (async () => {
            try {
                const response = await this.api_service?.queryAPI.bind(this.api_service)({
                    url: "/auth/refresh",
                    method: "POST"
                });

                if (!response) {
                    return null;
                }

                const { status, msg, data } = response;
                const { access_token, expires_in_secs } = data ?? {};

                if (access_token && expires_in_secs) {
                    this.setToken(access_token_key, access_token, expires_in_key, expires_in_secs);
                    this.logger.debug("✅ Access token refreshed successfully");
                    return access_token;
                } else {
                    throw new Error("Invalid refresh response");
                }
            } catch (error) {
                this.logger.error("❌ Failed to refresh access token", { error });
                this.clearToken();
                return null;
            } finally {
                this.is_refreshing = false;
                this.refresh_promise = null;
            }
        })();

        return this.refresh_promise;
    }

    // Method to Clear stored token info
    public clearToken(): void {
        // const access_token_key  = this.global_vars.getVariable(this.ACCESS_TOKEN_KEY);
        // const expires_in_key    = this.global_vars.getVariable(this.EXPIRES_AT_KEY);

        // if(!access_token_key || !expires_in_key) { return; }

        // this.local_storage_manager.removeData(access_token_key);
        // this.local_storage_manager.removeData(expires_in_key);

        // this.global_vars.updateVariable(this.ACCESS_TOKEN_KEY, null);
        // this.global_vars.updateVariable(this.EXPIRES_AT_KEY, null);

        if (this.refresh_timer) {
            clearTimeout(this.refresh_timer);
            this.is_refreshing = false;
            this.refresh_promise = null;
        }

        this.logger.log("Access token cleared");
    }
}

export default AuthTokenManagerUtil;

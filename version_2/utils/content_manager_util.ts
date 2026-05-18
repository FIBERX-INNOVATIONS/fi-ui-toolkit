import GlobalVariableManager from "./global_variable_manager_util";
import LoggerUtil from "./logger_util";
import { ContentObjectType } from "../types/util_type";

class ContentManagerUtil {
    public readonly name = "content_manager_util";
    private static instance: ContentManagerUtil | null = null;
    private global_var_instance: GlobalVariableManager;
    private content_data_key: string;
    private content_data: ContentObjectType;
    private is_loaded: boolean;
    private merged_api_responses: ContentObjectType;
    private logger: LoggerUtil;

    constructor() {
        this.global_var_instance = GlobalVariableManager.getInstance();
        this.content_data_key = "CONTENT_DATA";
        this.content_data = this.global_var_instance.getVariable(this.content_data_key) || {};
        this.is_loaded = false;
        this.merged_api_responses = {};
        this.logger = new LoggerUtil({ prefix: this.name, show_timestamp: false });
    }

    /** Singleton accessor */
    public static getInstance(): ContentManagerUtil {
        if (!ContentManagerUtil.instance) {
            ContentManagerUtil.instance = new ContentManagerUtil();
        }
        return ContentManagerUtil.instance;
    }

    /** Load content data from a JSON URL */
    public async load(json_url: string, json_key: string): Promise<boolean> {
        if (this.is_loaded) return true;

        try {
            const response = await fetch(json_url);

            if (!response?.ok) {
                throw new Error(`Failed to fetch content data: ${response.statusText}`);
            }

            const content: ContentObjectType = await response.json();
            const response_data = { [json_key]: content };

            this.content_data = { ...response_data };
            this.is_loaded = Object.keys(this.content_data).length > 0;

            if (this.is_loaded) {
                this.global_var_instance.setVariable(this.content_data_key, this.content_data);
            }

            return this.is_loaded;
        } catch (error: unknown) {
            this.logger.error("Error loading content data:", { error });
            throw error;
        }
    }

    /** Get a value from loaded content data by key path */
    public get<T = any>(key_path: string, default_value: T | null = null): T | null {
        if (!this.is_loaded) {
            this.logger.warn(`Missing key path: ${key_path}`);
            return default_value;
        }

        if (!this.content_data || Object.keys(this.content_data).length === 0) {
            this.logger.warn("No content data found in memory.");
            return default_value;
        }

        const value = key_path.split(".").reduce<ContentObjectType | undefined>((obj, key) => {
            return obj && Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
        }, this.content_data);

        if (value === undefined) {
            this.logger.warn(`Missing key path: ${key_path}`);
            return default_value;
        }

        return value as T;
    }

    /** Reset/clear stored data */
    public reset(): void {
        this.content_data = {};
        this.is_loaded = false;
        this.global_var_instance.setVariable(this.content_data_key, this.content_data);
    }

    /** Merge all module API responses into a single object */
    public mergeAllAPIResponsesObjects(): ContentObjectType {
        const all_api_responses = this.get<ContentObjectType>("content_resource.api_responses", {});

        for (const key in all_api_responses) {
            if (typeof all_api_responses[key] === "object" && all_api_responses[key] !== null) {
                Object.assign(this.merged_api_responses, all_api_responses[key]);
            }
        }

        return this.merged_api_responses;
    }

    /** Get a specific API response value */
    public getAPIResponseValue<T = any>(api_response: string): T {
        let dynamic_params: Record<string, string> = {};

        // 1️⃣ Extract dynamic values inside [ ... ]
        const bracket_matches = [...api_response.matchAll(/\[([^\]]+)\]/g)];

        if (bracket_matches.length > 0) {
            bracket_matches.forEach((match, index) => {
                dynamic_params[`val_${index + 1}`] = match[1]; // val_1, val_2, ...
            });

            // Replace [xxx] → [*] to build the lookup key
            api_response = api_response.replace(/\[[^\]]+\]/g, "[*]");
        }

        // 2️⃣ Get template
        let template = this.merged_api_responses[api_response];

        if (!template) {
            template = this.merged_api_responses["error_occurred"];
        }

        // 3️⃣ Replace placeholders in template
        if (typeof template === "string") {
            Object.entries(dynamic_params).forEach(([key, value]) => {
                const regex = new RegExp(`%${key}%`, "g");
                template = template.replace(regex, value);
            });
        }

        return template as T;
    }
}

export default ContentManagerUtil;

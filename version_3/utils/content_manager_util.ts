import LoggerUtil                   from "./logger_util";
import { ContentObjectType }        from "../types/util_type";

class ContentManagerUtil {
    public readonly name = "content_manager_util";
    private static instance: ContentManagerUtil | null = null;
    private readonly logger: LoggerUtil = new LoggerUtil({ prefix: this.name, show_timestamp: false });

    /** Static store to persist content data across instances */
    private static _is_loaded: boolean = false;
    private static _content_data: ContentObjectType = {};
    private static _merged_api_responses: ContentObjectType = {};

    private constructor() { }

    /** Singleton accessor */
    public static getInstance(): ContentManagerUtil {
        if (!ContentManagerUtil.instance) {
            ContentManagerUtil.instance = new ContentManagerUtil();
        }
        return ContentManagerUtil.instance;
    }

    /** Check if content has been loaded */
    public get is_loaded(): boolean {
        return ContentManagerUtil._is_loaded;
    }

    /** Access loaded content data */
    public get content_data(): ContentObjectType {
        return ContentManagerUtil._content_data;
    }

    /** Access merged API responses */
    public get merged_api_responses(): ContentObjectType {
        return ContentManagerUtil._merged_api_responses;
    }

    /** Load content data from a JSON URL (only once) */
    public async load(json_url: string, json_key: string): Promise<boolean> {
        if (ContentManagerUtil._is_loaded) return true;

        try {
            const response = await fetch(json_url);
            if (!response?.ok) throw new Error(`Failed to fetch content data: ${response.statusText}`);

            const content: ContentObjectType = await response.json();
            ContentManagerUtil._content_data = { [json_key]: content };
            ContentManagerUtil._is_loaded = Object.keys(ContentManagerUtil._content_data).length > 0;

            return ContentManagerUtil._is_loaded;
        } 
        catch (error: unknown) {
            this.logger.error("Error loading content data:", { error });
            throw error;
        }
    }

    /** Get a value from loaded content data by key path */
    public get<T = any>(key_path: string, default_value: T | null = null): T | null {
        if (!ContentManagerUtil._is_loaded) {
            this.logger.warn(`Missing key path: ${key_path}`);
            return default_value;
        }

        const value = key_path.split(".").reduce<ContentObjectType | undefined>((obj, key) => {
            return obj && Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
        }, ContentManagerUtil._content_data);

        if (value === undefined) {
            this.logger.warn(`Missing key path: ${key_path}`);
            return default_value;
        }

        return value as T;
    }

    /** Get a value from loaded content data by key path and rplace placeholders with recod values */
    public getWithRecord<T = any>(
        key_path: string,
        record: Record<string, any> = {},
        default_value: T | null = null
    ): T | null {

        // First get the base content
        let value = this.get<T>(key_path, default_value);

        if (value === null || value === undefined) {
            return default_value;
        }

        // Only process strings
        if (typeof value !== "string") {
            return value;
        }

        // Replace {{placeholders}} with record values
        const parsed_value = value.replace(/\{\{(.*?)\}\}/g, (_, key) => {

            const trimmed_key = key.trim();

            // Support nested keys like {{user.name}}
            const resolved = trimmed_key.split(".").reduce((obj: any, k: string) => {
                return obj && obj[k] !== undefined ? obj[k] : undefined;
            }, record);

            return resolved !== undefined && resolved !== null
                ? String(resolved)
                : "";
        });

        return parsed_value as T;
    }

    /** Reset/clear stored data */
    public reset(): void {
        ContentManagerUtil._content_data = {};
        ContentManagerUtil._is_loaded = false;
        ContentManagerUtil._merged_api_responses = {};
    }

    /** Merge all module API responses into a single object */
    public mergeAllAPIResponsesObjects(): ContentObjectType {
        const all_api_responses = this.get<ContentObjectType>("content_resource.api_responses", {});

        for (const key in all_api_responses) {
            if (typeof all_api_responses[key] === "object" && all_api_responses[key] !== null) {
                Object.assign(ContentManagerUtil._merged_api_responses, all_api_responses[key]);
            }
        }

        return ContentManagerUtil._merged_api_responses;
    }

    /** Get a specific API response value */
    public getAPIResponseValue<T = any>(api_response: string): T {
        let dynamic_params: Record<string, string> = {};

        // Extract dynamic values inside [ ... ]
        const bracket_matches = [...api_response.matchAll(/\[([^\]]+)\]/g)];

        if (bracket_matches.length > 0) {
            bracket_matches.forEach((match, index) => {
                dynamic_params[`val_${index + 1}`] = match[1];  // val_1, val_2, ...
            });
            // Replace [xxx] → [*] to build the lookup key
            api_response = api_response.replace(/\[[^\]]+\]/g, "[*]");
        }

        // Get template
        let template = ContentManagerUtil._merged_api_responses[api_response] || 
                       ContentManagerUtil._merged_api_responses["error_occurred"];

        // Replace placeholders in template
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
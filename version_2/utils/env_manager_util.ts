import EncryptorDecryptorUtil from "./encryptor_decryptor_util";
import GlobalVariableManagerUtil from "./global_variable_manager_util";
import LoggerUtil from "./logger_util";
import { ENVInterface } from "../types/env_type";

class ENVManagerUtil {
    public readonly name = "env_manager_util";
    public env_data: ENVInterface = {};
    private global_vars: GlobalVariableManagerUtil;
    private encryptor_decryptor_util: EncryptorDecryptorUtil;
    private logger: LoggerUtil;

    constructor() {
        this.global_vars = GlobalVariableManagerUtil.getInstance();
        this.encryptor_decryptor_util = new EncryptorDecryptorUtil();
        this.logger = new LoggerUtil({ prefix: this.name, show_timestamp: false });

        this.loadEnv();
    }

    // Method to Load YAML env file from public/
    public loadEnv(): void {
        try {
            const env_data = import.meta.env;
            const env_data_keys = Object.keys(env_data);

            for (const key of env_data_keys) {
                const encrypted_value = env_data[key]?.toString() ?? null;

                if (!encrypted_value) {
                    continue;
                }

                const decrypted_value = this.encryptor_decryptor_util.decryptV2<string>(encrypted_value);

                this.env_data[key] = decrypted_value;
            }

            this.global_vars.setVariable("ENV", this.env_data);
        } catch (error: unknown) {
            this.logger.error("Failed to load environment variables", error);
            throw error;
        }
    }

    // Method to get an env variable value
    public getEnvVar<T = any>(key: string, default_value?: T): T | undefined {
        if (key in this.env_data) {
            return this.env_data[key];
        }

        if (key in import.meta.env) {
            return import.meta.env[key] as T;
        }

        return default_value;
    }
}

export default ENVManagerUtil;

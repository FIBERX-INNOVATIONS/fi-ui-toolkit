import GlobalVariableManagerUtil from "./global_variable_manager_util";
import EncryptorDecryptorUtil from "./encryptor_decryptor_util";
import LoggerUtil from "./logger_util";

class LocalStorageManagerUtil {
    public readonly name = "local_storage_manager_util";
    private global_vars: GlobalVariableManagerUtil;
    private encryptor_decryptor: EncryptorDecryptorUtil;
    private logger: LoggerUtil;

    constructor() {
        this.global_vars = GlobalVariableManagerUtil.getInstance();
        this.encryptor_decryptor = new EncryptorDecryptorUtil();
        this.logger = new LoggerUtil({ prefix: this.name, show_timestamp: false });
    }

    // Method to parse local storage data value
    private parseData(data_value: string): unknown {
        try {
            return JSON.parse(data_value);
        } catch {
            return data_value;
        }
    }

    // Method to Get all keys in localStorage
    public getAllKeys(): string[] {
        try {
            const keys: string[] = [];

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);

                if (key) {
                    keys.push(key);
                }
            }

            return keys;
        } catch (error: unknown) {
            this.logger.error("Failed to get all Local Storage keys", { error });
            return [];
        }
    }

    // ✅ Check if key exists in localStorage
    public hasKey(key: string): boolean {
        try {
            if (!key) {
                return false;
            }

            return localStorage.getItem(key) !== null;
        } catch (error: unknown) {
            this.logger.error(`Failed checking Local Storage key: ${key}`, { error });
            return false;
        }
    }

    // Method to get a data from storage
    public getData<T>(key: string, encrypted = true): T | null {
        try {
            if (!key) {
                return null;
            }

            const raw_data = localStorage.getItem(key);

            if (!raw_data) {
                return null;
            }

            const decrypted_data = encrypted
                ? this.encryptor_decryptor.decryptV2<T>(raw_data)
                : this.parseData(raw_data);

            return decrypted_data as T;
        } catch (error: unknown) {
            this.logger.error(`Failed get Local Storage Data for ${key}`, { error });
            return null;
        }
    }

    // Method to set data in storage
    public setData<T>(key: string, value: T, encrypt = true): boolean {
        try {
            if (!key) {
                return false;
            }

            const serialized = encrypt
                ? this.encryptor_decryptor.encryptV2(value)?.encrypted_data
                : JSON.stringify(value);

            if (!serialized) {
                throw new Error("Staorage Data Serialization failed");
            }

            localStorage.setItem(key, serialized);

            return true;
        } catch (error: unknown) {
            this.logger.error(`Failed set Local Storage Data for ${key}`, { error });
            return false;
        }
    }

    // Method  to remove data from storage
    public removeData(key: string): boolean {
        try {
            if (!key) {
                return false;
            }

            localStorage.removeItem(key);
            return true;
        } catch (error: unknown) {
            this.logger.error(`Failed remove Local Storage Data for ${key}`, { error });
            return false;
        }
    }
}

export default LocalStorageManagerUtil;

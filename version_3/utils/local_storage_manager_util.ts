
import EncryptorDecryptorUtil from "./encryptor_decryptor_util";
import { 
    StorageFieldType,
    StorageSchemaType
} from "../types/util_type";

class LocalStorageManagerUtil<TSchema extends StorageSchemaType> {
    private static instance: LocalStorageManagerUtil<any>;

    private readonly schema: TSchema;
    private readonly encryptor: EncryptorDecryptorUtil;

    private constructor(schema: TSchema) {
        this.schema = schema;
        this.encryptor = EncryptorDecryptorUtil.getInstance();
    }

    public static init<T extends StorageSchemaType>(schema: T): LocalStorageManagerUtil<T> {
        if (!LocalStorageManagerUtil.instance) {
            LocalStorageManagerUtil.instance = new LocalStorageManagerUtil(schema);
        }

        return LocalStorageManagerUtil.instance;
    }

    public static getInstance<T extends StorageSchemaType>(): LocalStorageManagerUtil<T> {
        if (!LocalStorageManagerUtil.instance) {
            throw new Error("LocalStorageManagerUtil not initialized");
        }

        return LocalStorageManagerUtil.instance;
    }

    public set<K extends keyof TSchema>(
        key: K,
        value: TSchema[K] extends StorageFieldType<infer V> ? V : never
    ): void {
        const field = this.schema[key as string];

        const encrypted_value = this.encryptor.encrypt(value);

        localStorage.setItem(field.encrypted_key, encrypted_value);
    }

    public get<K extends keyof TSchema>(
        key: K
    ): TSchema[K] extends StorageFieldType<infer V> ? V | null : never {
        const field = this.schema[key as string];

        const stored_value = localStorage.getItem(field.encrypted_key);

        if (!stored_value) {
            return field.default_value ?? null;
        }

        return this.encryptor.decrypt(stored_value);
    }

    public remove<K extends keyof TSchema>(key: K): void {
        const field = this.schema[key as string];
        localStorage.removeItem(field.encrypted_key);
    }

    public clear(): void {
        Object.values(this.schema).forEach((field) => {
            localStorage.removeItem(field.encrypted_key);
        });
    }
}

export default LocalStorageManagerUtil;
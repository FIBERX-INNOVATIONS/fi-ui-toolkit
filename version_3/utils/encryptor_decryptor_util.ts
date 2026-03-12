
import { EncryptorConfigType } from "../types/util_type";


class EncryptorDecryptorUtil {
    private static instance: EncryptorDecryptorUtil;

    private readonly corpus: string[];
    private readonly shift_key: number;
    private readonly corpus_length: number;

    private constructor(config: EncryptorConfigType) {
        if (!config.corpus.length) {
            throw new Error("Corpus cannot be empty");
        }

        this.corpus         = config.corpus;
        this.shift_key      = config.shift_key;
        this.corpus_length  = config.corpus.length;
    }

    static init(config: EncryptorConfigType): EncryptorDecryptorUtil {
        if (!EncryptorDecryptorUtil.instance) {
            EncryptorDecryptorUtil.instance = new EncryptorDecryptorUtil(config);
        }
        return EncryptorDecryptorUtil.instance;
    }

    static getInstance(): EncryptorDecryptorUtil {
        if (!EncryptorDecryptorUtil.instance) {
            throw new Error("EncryptorDecryptorUtil not initialized");
        }
        return EncryptorDecryptorUtil.instance;
    }

    private stringify(value: unknown): string {
        if (typeof value === "string") return value;
        return JSON.stringify(value);
    }

    public encrypt (input: unknown): string {
        const value = this.stringify(input);

        return value
        .split("")
        .map((char) => {
            const index = this.corpus.indexOf(char);

            if (index === -1) return char;

            const shift_index = (index + this.shift_key) % this.corpus_length;

            return this.corpus[shift_index];
        })
        .join("");
    }

    public decrypt<T = unknown>(encrypted: string): T {
        const decrypted = encrypted
        .split("")
        .map((char) => {
            const index = this.corpus.indexOf(char);

            if (index === -1) return char;

            const shift_index =
            (index - this.shift_key + this.corpus_length) % this.corpus_length;

            return this.corpus[shift_index];
        })
        .join("");

        try {
        return JSON.parse(decrypted) as T;
        } catch {
        return decrypted as unknown as T;
        }
    }
}

export default EncryptorDecryptorUtil
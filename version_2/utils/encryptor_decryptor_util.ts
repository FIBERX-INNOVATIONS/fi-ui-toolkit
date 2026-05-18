import crypto from "crypto";
import GlobalVariableManagerUtil from "./global_variable_manager_util";
import LoggerUtil from "./logger_util";
import { EncryptedV2Interface } from "../types/util_type";
import { ENCRYPT_V1_SECRET_KEY } from "../enums/constants.enum";

class EncryptorDecryptorUtil {
    public readonly name = "encryptor_decryptor_util";
    private readonly encrypt_v1_algorithm: string;
    private readonly encrypt_v1_iv_length: number;
    private readonly global_vars: GlobalVariableManagerUtil;
    private logger: LoggerUtil;
    private data_shift_key: number;
    private readonly corpus: string[];

    constructor() {
        this.encrypt_v1_algorithm = "aes-256-cbc";
        this.encrypt_v1_iv_length = 16;
        this.global_vars = GlobalVariableManagerUtil.getInstance();

        this.logger = new LoggerUtil({ prefix: this.name, show_timestamp: false });
        this.data_shift_key = 14;
        this.corpus = this.getFixedCorpus();
    }

    // Methopd to get fixed corpus
    private getFixedCorpus(): string[] {
        const corpus = [
            "6",
            ";",
            "s",
            "[",
            "w",
            "*",
            "n",
            "K",
            "h",
            "U",
            "#",
            "P",
            "T",
            "&",
            "M",
            "2",
            "}",
            "x",
            ")",
            "{",
            "|",
            "i",
            "%",
            "m",
            ":",
            "E",
            "q",
            "?",
            "0",
            "@",
            "1",
            "v",
            "A",
            "W",
            "<",
            "y",
            "Y",
            "4",
            "5",
            ".",
            "e",
            "G",
            ",",
            "D",
            "7",
            "I",
            "j",
            ">",
            "g",
            "t",
            "k",
            "c",
            "V",
            "9",
            "J",
            "L",
            "u",
            "H",
            "b",
            "Z",
            "+",
            '"',
            "'",
            "a",
            "f"
        ];

        return [...new Set(corpus)];
    }

    // ==============================
    // Shift Cipher (V2)
    // ==============================
    public encryptV2(data: unknown): EncryptedV2Interface {
        if (!this.corpus || !this.data_shift_key) {
            throw new Error("Environment not initialized.");
        }

        const input_data = typeof data === "string" ? data : JSON.stringify(data);
        const array_input_data = input_data.split("");
        let encrypted_data = "";

        for (const char of array_input_data) {
            const index = this.corpus.indexOf(char);

            if (index !== -1) {
                const new_index = (index + this.data_shift_key) % this.corpus.length;
                encrypted_data += this.corpus[new_index];
            } else {
                encrypted_data += char;
            }
        }

        return { encrypted_data };
    }

    public decryptV2<T>(encrypted_data: string): T | string {
        try {
            if (!this.corpus || !this.data_shift_key) {
                throw new Error("Environment not initialized.");
            }

            const array_input_data = encrypted_data.split("");
            let decrypted_data = "";

            for (const char of array_input_data) {
                const index = this.corpus.indexOf(char);

                if (index !== -1) {
                    const calc_shift = index - this.data_shift_key;
                    const new_index = calc_shift < 0 ? this.corpus.length + calc_shift : calc_shift;
                    decrypted_data += this.corpus[new_index];
                } else {
                    decrypted_data += char; // keep characters not in corpus
                }
            }

            try {
                return JSON.parse(decrypted_data) as T;
            } catch {
                return decrypted_data as T;
            }
        } catch (error: unknown) {
            throw error;
        }
    }
}

export default EncryptorDecryptorUtil;

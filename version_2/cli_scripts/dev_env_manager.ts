import fs                           from "fs";
import path                         from "path";
import readline                     from "readline/promises";
import { 
    stdin as input, 
    stdout as output }              from "process";
import EncryptorDecryptorUtil       from "../utils/encryptor_decryptor_util";
import GlobalVariableManagerUtil    from "../utils/global_variable_manager_util";
import LoggerUtil                   from "../utils/logger_util";
import { ENVValue }                 from "../types/env_type";
import {ENCRYPT_V1_SECRET_KEY}      from "../enums/constants.enum";

class DevEnvManager {
    public readonly name = "dev_env_manager";
    private rl = readline.createInterface({ input, output });
    private env_file_path: string = "";
    private env_data: Record<string, string> = {};
    private encryptor_decryptor_util: EncryptorDecryptorUtil;
    private logger: LoggerUtil;
    private global_vars: GlobalVariableManagerUtil;

    constructor() {
        this.global_vars                = GlobalVariableManagerUtil.getInstance();
        this.encryptor_decryptor_util   = new EncryptorDecryptorUtil();
        this.logger                     = new LoggerUtil({ prefix: this.name, show_timestamp: true });

        this.setEncryptSecret();
    }

    // Method to set encrypt secret key
    private setEncryptSecret(): void {
        const secret_key        = this.global_vars.getVariable(ENCRYPT_V1_SECRET_KEY)
        const encrypted_data    = this.encryptor_decryptor_util.encryptV2(secret_key)?.encrypted_data;

        if(!encrypted_data) {
            const msg = `Failed to encrypt value encryption secret key: `;
            this.logger.error(msg,{ encrypted_data });
            throw new Error(msg);
        }
        this.env_data[ENCRYPT_V1_SECRET_KEY]  =  encrypted_data;
    }

    // Method to read a .env file
    private readENVFile(): void {
        if (!fs.existsSync(this.env_file_path)) {
            this.env_data = {};
            return;
        }

        const content = fs.readFileSync(this.env_file_path, "utf8");
        content.split(/\r?\n/).forEach((line) => {
            // Ignore empty lines and comments
            if (!line || line.trim().startsWith("#")) { return; }

            const [key, ...rest] = line.split("=");

            if (key) {
                this.env_data[key.trim()] = rest.join("=").trim();
            }
        });
    }

    // Method Write YAML file
    private writeENVFile(): void {
        const file_content = Object.entries(this.env_data).map(([key, value]) => `${key}="${value}"`).join("\n");
        fs.writeFileSync(this.env_file_path, file_content, { encoding: "utf-8" });
    }

    // Method to try to parse json or retrun string
    private parseENVValue (raw_value: string): ENVValue {
        let value: ENVValue;

        try { value = JSON.parse(raw_value); } 
        catch { value = raw_value; }

        return value;
    }
 
    // Method to Prompt for directory and ensure exists
    private async promptDirectory(): Promise<void> {
        const dir           = await this.rl.question("📂 Enter the directory to create/update .env File: ");
        const abs_dir       = path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);

        if (!fs.existsSync(abs_dir)) { fs.mkdirSync(abs_dir, { recursive: true }); }

        this.env_file_path = path.join(abs_dir, ".env");
        this.logger.log(`✅ Env file path set to: ${this.env_file_path}`);
    }

    // Method to Prompt mode
    private async promptMode(): Promise<"create" | "update"> {
        const mode = await this.rl.question("⚡ Select mode: create / update: ");

        if (mode !== "create" && mode !== "update") {
            this.logger.log("❌ Invalid mode. Please enter 'create' or 'update'.");
            return this.promptMode();
        }

        return mode;
    }

    // Method to Prompt for new keys and values 
    private async promptNewKeys(): Promise<void> {
        const keys_input    = await this.rl.question("📝 Enter new env variable keys (comma separated): ");
        const keys          = keys_input.split(",").map(k => k.trim()).filter(Boolean);

        for (const key of keys) {
            const formatted_key     = key.toUpperCase().startsWith("VITE_") ? key.toUpperCase() : `VITE_${key.toUpperCase()}`;
            const raw_value         = await this.rl.question(`💡 Enter value for "${key}": `);
            const value: ENVValue   = this.parseENVValue(raw_value);
            const encrypted_value   = this.encryptor_decryptor_util.encryptV2(JSON.stringify(value))?.encrypted_data;

            if(!encrypted_value) {
                this.logger.error(`Failed to encrypt value ${raw_value}: `, { encrypted_value })
                return;
            }

            this.env_data[formatted_key] = encrypted_value
        }
    }

    // Method to Display env data in readable form and confirm
    private async confirmEnvData(): Promise<boolean> {
        this.logger.log("🔑 Env data to store:");
        for (const key in this.env_data) {
            const encrypted_value = this.env_data[key];
            const decrypted_value = this.encryptor_decryptor_util.decryptV2<string>(encrypted_value);

            if(!decrypted_value) { 
                this.logger.log(`${key}: [ENCRYPTED DATA, FAILED TO DECRYPT]`); 
                continue;
            }

            const parse_decrypted_value = this.parseENVValue(decrypted_value);
            
            this.logger.log(`${key}:`, parse_decrypted_value);
        }
        const confirm = await this.rl.question("✅ Confirm and save? (yes/no): ");
        return confirm.toLowerCase() === "yes";
    }

    // Method to Update mode
    private async promptUpdate(): Promise<void> {
        const keys = Object.keys(this.env_data);

        if (!keys.length) {
            this.logger.log("⚠️ No keys found in .env Switching to create mode.");
            await this.promptNewKeys();
            return;
        }
        this.logger.log("📋 Existing keys:");

        keys.forEach((key, idx) => console.log(`${idx + 1}. ${key}`));

        const selection     = await this.rl.question("➡️ Select key number to update: ");
        const idx           = parseInt(selection) - 1;

        if (isNaN(idx) || idx < 0 || idx >= keys.length) {
            this.logger.log("❌ Invalid selection.");
            return this.promptUpdate();
        }

        const keys_to_update    = keys[idx];
        const raw_value         = await this.rl.question(`💡 Enter new value for "${keys_to_update}": `);
        const value: ENVValue   = this.parseENVValue(raw_value);
        const encrypted_value   = this.encryptor_decryptor_util.encryptV2(JSON.stringify(value))?.encrypted_data;

        if(!encrypted_value) {
            this.logger.error(`Failed to encrypt value ${raw_value}: `, { encrypted_value })
            return;
        }

        this.env_data[keys_to_update] = encrypted_value
    }

    // Method to Run the interactive CLI
    public async run(): Promise<void> {
        try {
            this.logger.log("🚀 Welcome to DevEnvManager CLI!");
            this.logger.log("🔒 This tool lets you create/update an encrypted .env for your front-end project.\n");

            await this.promptDirectory();
            this.readENVFile();

            const mode = await this.promptMode();

            if (mode === "create") { await this.promptNewKeys(); }
            
            else { await this.promptUpdate(); }

            const confirmed = await this.confirmEnvData();

            if (confirmed) {
                this.writeENVFile();
                this.logger.log("🎉 Env file saved successfully!");
            } 
            else { this.logger.log("❌ Operation canceled."); }
        }
        catch(error: unknown) {
            this.logger.error(`Failed to execute DevEnvManager CLI`, { error });
        }
        finally { this.rl.close(); }
    }
}

/** Execute CLI */
(async () => {
    const manager = new DevEnvManager();
    await manager.run();
})();


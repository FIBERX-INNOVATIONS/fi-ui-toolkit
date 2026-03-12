
import crypto           from "crypto";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter    from "dayjs/plugin/isSameOrAfter";
import axios            from "axios";


dayjs.extend(isSameOrAfter);

class InputValidatorUtil {
    private static readonly optional_field_regex       = /^[a-zA-Z0-9_\-]+$/; 
    private static readonly name_regex_reg_exp         = /^[A-Za-z.'\s/_-]*$/;
    private static readonly namey_regex_reg_exp        = /^[A-Za-z0-9.'\s,/_\-()&]*$/;
    private static readonly email_regex_reg_exp        = /^(?=.{1,255}$)[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]{1,190}\.[a-zA-Z]{2,}$/i;
    private static readonly tel_regex_reg_exp          = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/;
    private static readonly pass_regex_reg_exp         = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
    private static readonly url_regex_reg_exp          = /^(https?:\/\/)?((localhost|[a-zA-Z0-9-_.]+)(:[0-9]{1,5})?)(\/[a-zA-Z0-9-._~:/?#@!$&'()*+,;=%]*)?$/;
    private static readonly text_area_regex_reg_exp     = /^(?=.*[a-zA-Z])[\p{L}\p{N}\p{P}\p{Zs}–—“”‘’]*$/u;
    private static readonly uuid_regex_reg_exp         = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    private static readonly custom_uuid_regex_reg_exp  = /^[A-Z0-9]{12}-[A-Z0-9]{12}-[A-Z0-9]{12}-[A-Z0-9]{12}$/;

    public static isValidateIn = (value: any, allowed: any[]) => allowed.includes(value);

    /** ✅ Check member roles */
    static isAdmin(name: string) { return ["SuperAdmin", "AdminI", "AdminT"].includes(name); }

    static isSuperAdmin(name: string) { return name === "SuperAdmin"; }

    static isLowerSnakeCase(str: string): boolean { return /^[a-z]+(_[a-z]+)*$/.test(str); }

    static isUpperPascalCase(str: string): boolean { return /^[A-Z][a-zA-Z]*$/.test(str); }

    static isEmpty(input: any): boolean { return !input || input.toString().trim() === ""; }

    static isValidOptionalField(str: string): boolean { return this.optional_field_regex.test(str); }

    static isValidName(name: string): boolean { return this.name_regex_reg_exp.test(name); }

    static isValidNamey(name: string): boolean { return this.namey_regex_reg_exp.test(name); }

    static isValidEmail(email: string): boolean { return this.email_regex_reg_exp.test(email) && email.length <= 254; }

    static isValidPhoneNumber(tel: string): boolean { return this.tel_regex_reg_exp.test(tel); }

    static isValidPassword(password: string): boolean { return this.pass_regex_reg_exp.test(password); }

    static isDigit(input: any): boolean { return !isNaN(input); }

    static isValidInteger(input: any): boolean { return Number.isInteger(input) && input > 0; }

    static isValidFloat(input: any): boolean { return !isNaN(input) && parseFloat(input) > 0; }

    static isValidURLY(url: string): boolean {
        try { 
            new URL(url);
            return true;
        } 
        catch (_) { return false; }
    }

    static isValidURL(url: string): boolean { return this.url_regex_reg_exp.test(url) && this.isValidURLY(url); }

    static isBoolean(value: any): boolean { return typeof value === "boolean" || ["1", "0"].includes(String(value)); }

    static isValidLongText(text: string): boolean {
        if (!text || typeof text !== "string") { return false; }

        const forbidden_pattern = /[<>{};`]/;

        if (forbidden_pattern.test(text)) { return false; }
        
        return this.text_area_regex_reg_exp.test(text.trim());
    }

    static isValidUUID(uuid: string): boolean { return this.uuid_regex_reg_exp.test(uuid); }
        
    static isValidCustomUUID(uuid: string): boolean { return this.custom_uuid_regex_reg_exp.test(uuid); }
    
    static isArrayUnique(arr: any[]): boolean { return new Set(arr).size === arr.length; }
    
    static isValidFutureDate(date_string: string): boolean {
        const date = dayjs(date_string);

        return date.isValid() && date.isAfter(dayjs());
    }

    static isValidDateAndDifference(
        input?: string | null,
        unit: "years" | "days" | "hours" | "minutes" | "seconds" = "years"
    ): { date: Dayjs; difference: number } | null {
        if(!input) { return null }
        
        const date = dayjs(input);

        // Check validity
        if (!date.isValid()) { return null; }

        // Compute difference between now and the input date
        return { date, difference: dayjs().diff(date, unit) };
    }


    static isSafeHashCompare(a: string, b: string): boolean {
        const buf1 = Buffer.from(a);
        const buf2 = Buffer.from(b);
        if (buf1.length !== buf2.length) { return false; }

        return crypto.timingSafeEqual(buf1, buf2);
    }

    static isDeepEqual(a: any, b: any): boolean {

        // Strict equal handles primitives + same reference
        if (a === b) return true;

        // Handle null / undefined
        if (a == null || b == null) return a === b;

        // Handle Date
        if (a instanceof Date && b instanceof Date) {
            return a.getTime() === b.getTime();
        }

        // Handle functions (compare source)
        if (typeof a === "function" && typeof b === "function") {
            return a.toString() === b.toString();
        }

        // Handle Sequelize DataTypes
        if (a?.key && b?.key) {
            if (a.key !== b.key) return false;

            const aOpts = a.options || {};
            const bOpts = b.options || {};

            return InputValidatorUtil.isDeepEqual(aOpts, bOpts);
        }

        // Handle arrays
        if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) return false;

            for (let i = 0; i < a.length; i++) {
                if (!InputValidatorUtil.isDeepEqual(a[i], b[i])) return false;
            }

            return true;
        }

        // Handle objects
        if (typeof a === "object" && typeof b === "object") {
            const aKeys = Object.keys(a);
            const bKeys = Object.keys(b);

            if (aKeys.length !== bKeys.length) return false;

            for (const key of aKeys) {
                if (!bKeys.includes(key)) return false;
                if (!InputValidatorUtil.isDeepEqual(a[key], b[key])) return false;
            }

            return true;
        }

        return false;
    }

    static hasInputChanged( 
        new_input: Record<string, any>, 
        existing_data: Record<string, any>, 
        keys_to_check: string[] 
    ): boolean {
        // Normalize values (booleans, "true"/"false", "1"/"0", null-like)
        const normalize = (val: any): any => {
            if (val === "true") return true;
            if (val === "false") return false;

            if (val === "1") return true;
            if (val === "0") return false;

            return val;
        };

        // Utility to get nested value by dot notation
        const getNestedValue = (obj: Record<string, any>, path: string): any => {
            return path.split('.').reduce((acc, part) => {
                if (acc && typeof acc === 'object' && part in acc) {
                    return acc[part];
                }
                return undefined;
            }, obj);
        };

        for (const key of keys_to_check) {
            if (!(key in new_input)) { continue; }

            const new_val = normalize(getNestedValue(new_input, key));
            const old_val = normalize(getNestedValue(existing_data, key));

            if (!InputValidatorUtil.isDeepEqual(new_val, old_val)) {
                console.log("🔺 CHANGED:", key, { new_val, old_val });
                return true;
            }
        }

        return false;
    }

    static containsOnlyNumbers(input: string | string[]): boolean {
        const values = Array.isArray(input) ? input : [input];

        return values.every(value => /^\d+$/.test(value));
    }

}

export default InputValidatorUtil;
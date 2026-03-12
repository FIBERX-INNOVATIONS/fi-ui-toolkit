import axios from "axios";
import dayjs from "dayjs";

import {
    CountLookupItemInterface,
} from "../types/util_type";

// Utility class for transforming and formatting input values
class InputTransformerUtil {
    /**
     * Lookup table for number formatting suffixes
     */
    private static count_lookup: CountLookupItemInterface[] = [
        { value: 1, symbol: "" },
        { value: 1_000, symbol: "K" },
        { value: 1_000_000, symbol: "M" },
        { value: 1_000_000_000, symbol: "B" },
        { value: 1_000_000_000_000, symbol: "T" },
    ];

    /**
     * Capitalize the first letter of a string
     */
    public static capitalize(input: string): string {
        return input
            ? input.charAt(0).toUpperCase() + input.slice(1).toLowerCase()
            : input;
    }

    /**
     * Capitalize the first letter of each word in a string
     */
    public static capitalizeEachWord(input?: string): string {
        if (!input) {
            return "";
        }

        return input
            .split(" ")
            .map((word) => this.capitalize(word))
            .join(" ");
    }

    /**
     * Format date of birth to YYYY-MM-DD
     */
    public static formatDob(dob?: string | Date | null): string | null {
        return dob ? dayjs(dob).format("YYYY-MM-DD") : null;
    }

    /**
     * Format full name from first and last name
     */
    public static formatMemberFullName(
        first_name?: string,
        last_name?: string
    ): string | null {
        return first_name && last_name ? `${first_name} ${last_name}` : null;
    }

    /**
     * Format member preview string
     */
    public static formatMemberPreview(
        first_name?: string,
        last_name?: string,
        public_id?: string
    ): string | null {
        return first_name && last_name && public_id
            ? `(${public_id}) - ${first_name} ${last_name}`
            : null;
    }

    /**
     * Format a number with commas
     */
    public static formatAmount(amount: number): string {
        if (!amount) {
            return "0";
        }

        return amount > 0
            ? Intl.NumberFormat("en-US").format(amount)
            : amount.toString();
    }

    /**
     * Format large numbers with suffixes (K, M, B, T)
     */
    public static nFormatter(num: number, digits = 1): string {
        const lookup_item = this.count_lookup
            .slice()
            .reverse()
            .find((item) => num >= item.value);

        if (!lookup_item) {
            return "0";
        }

        const formatted_value = (num / lookup_item.value)
            .toFixed(digits)
            .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1");

        return `${formatted_value}${lookup_item.symbol}`;
    }

    /**
     * Round a number to two decimal places
     */
    public static roundToTwoDecimalPlaces(value: number): number {
        if (typeof value !== "number") {
            throw new Error("Input must be a number");
        }

        return Math.round(value * 100) / 100;
    }

    /**
     * Remove leading zeros from a number or string
     */
    public static removeLeadingZeros(value: string | number): string {
        return value.toString().replace(/^0+/, "") || "0";
    }


    /**
     * Convert date of birth string to age
     */
    public static dobToAge(dob_string: string): number {
        const dob_date = new Date(dob_string);
        const today = new Date();

        let age = today.getFullYear() - dob_date.getFullYear();
        const month_difference =
            today.getMonth() - dob_date.getMonth();

        if (
            month_difference < 0 ||
            (month_difference === 0 &&
                today.getDate() < dob_date.getDate())
        ) {
            age--;
        }

        return age;
    }


    /**
     * Convert snake_case to Title Case
     */
    public static toTitleCase(input: string): string {
        return input
            .split("_")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(" ");
    }



    /**
     * Safely parse JSON input
     */
    public static toJson<T = unknown>(
        json_input: string | unknown | null | undefined
    ): T | null {
        try {
            if (!json_input) {
                return null;
            }

            if (typeof json_input === "string") {
                return JSON.parse(json_input) as T;
            }

            if (typeof json_input === "object") {
                return json_input as T;
            }

            return null;
        } catch {
            return null;
        }
    }


    /**
     * Compare two records and detect changes
     */
    public static detectChanges(
        old_record: Record<string, any> = {},
        new_record: Record<string, any> = {},
        keys_to_check?: string[]
    ): {
        readable: string;
        structured: Record<string, { old: any; new: any }>;
    } {
        const structured_diff: Record<
            string,
            { old: any; new: any }
        > = {};

        const all_keys =
            keys_to_check ?? Object.keys(new_record);

        for (const key of all_keys) {
            const old_value = old_record[key];
            const new_value = new_record[key];

            if (old_value == new_value) {
                continue;
            }

            const formatted_old =
                typeof old_value === "object" &&
                old_value !== null
                    ? JSON.stringify(old_value)
                    : String(old_value ?? "null");

            const formatted_new =
                typeof new_value === "object" &&
                new_value !== null
                    ? JSON.stringify(new_value)
                    : String(new_value ?? "null");

            structured_diff[key] = {
                old: formatted_old,
                new: formatted_new,
            };
        }

        const readable_changes = Object.entries(
            structured_diff
        )
            .map(
                ([key, value]) =>
                    `${key} changed from '${value.old}' → '${value.new}'`
            )
            .join("; ");

        return {
            readable:
                readable_changes ||
                "No significant changes detected",
            structured: structured_diff,
        };
    }

    /**
     * Normalize social links object keys
     */
    public static formatLinksObject(
        links: Record<string, string>
    ): Record<string, string> {
        const formatted_links: Record<string, string> = {};

        for (const [key, value] of Object.entries(links)) {
            const normalized_key = key
                .toLowerCase()
                .endsWith("_link")
                ? key.toLowerCase()
                : `${key.toLowerCase()}_link`;

            formatted_links[normalized_key] = value;
        }

        return formatted_links;
    }

    // Method to build nested object from dotted pats
    public static buildNestedObject(paths: string[]): any {
        const root: any = {};

        for (const p of paths) {
            const parts = p.split(".");
            let current = root;

            for (let i = 0; i < parts.length; i++) {
                const key = parts[i];

                if (!current[key]) {
                    current[key] =
                        i === parts.length - 1 ? "string" : {};
                }

                current = current[key];
            }
        }

        return root;
    }

    // Method to join strings by
    public static joinStringsBy(parts: string | string[], separator: string): string {
        // Ensure parts is always a flat array of strings
        const flat_parts: string[] = Array.isArray(parts) ? parts : [parts];

        // Filter out empty/null/undefined strings to avoid extra separators
        const valid_parts = flat_parts.filter(part => part !== null && part !== undefined && part !== "");

        return valid_parts.join(separator);
    }

    // Method to get future date
    public static getFutureDateFromMinutes(minutes: number): Date | null {
        if (!minutes || minutes <= 0) {
            return null;
        }

        return dayjs()
            .add(minutes, "minute")
            .toDate();
    }
    
}

export default InputTransformerUtil;

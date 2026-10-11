import { IBAN_COUNTRY_LENGTHS } from "../configs/iban_country_lengths";

class IbanValidator {
    // Method to remove presentation spaces and uppercase ASCII letters without disguising invalid Unicode.
    public static normalize(value: string): string {
        return value
            .trim()
            .replace(/\s/g, "")
            .replace(/[a-z]/g, (letter) => letter.toUpperCase());
    }

    // Method to group an IBAN for display while retaining invalid characters for correction.
    public static format(value: string): string {
        return (
            this.normalize(value)
                .match(/.{1,4}/g)
                ?.join(" ") ?? ""
        );
    }

    // Method to return a field-specific message key; an empty result means the format is valid.
    public static validate(value: string, allowed_countries?: readonly string[]): string {
        const text = this.normalize(value);

        if (!/^[A-Z0-9]+$/.test(text)) {
            return "validation_iban_characters_text";
        }

        if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(text)) {
            return "validation_iban_structure_text";
        }

        const country = text.slice(0, 2);
        const length = IBAN_COUNTRY_LENGTHS[country];

        if (!length) {
            return "validation_iban_country_text";
        }

        // A host may restrict its payout route independently of the worldwide registry.
        if (allowed_countries && !allowed_countries.includes(country)) {
            return "validation_iban_route_text";
        }

        if (text.length !== length) {
            return "validation_iban_length_text";
        }

        return this.hasValidChecksum(text) ? "" : "validation_iban_checksum_text";
    }

    // Method to calculate MOD-97 incrementally without exceeding JavaScript's safe integer precision.
    private static hasValidChecksum(value: string): boolean {
        // The generated check-digit range is 02–98; equivalent out-of-range residues are invalid.
        const check_digits = Number(value.slice(2, 4));

        if (check_digits < 2 || check_digits > 98) {
            return false;
        }

        const rearranged = value.slice(4) + value.slice(0, 4);
        let remainder = 0;

        // Letters represent two decimal digits: A = 10 through Z = 35.
        for (const character of rearranged) {
            const digits = /[A-Z]/.test(character) ? String(character.charCodeAt(0) - 55) : character;

            for (const digit of digits) {
                remainder = (remainder * 10 + Number(digit)) % 97;
            }
        }

        return remainder === 1;
    }
}

export default IbanValidator;

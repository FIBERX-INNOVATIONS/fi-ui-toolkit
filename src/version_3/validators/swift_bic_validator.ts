class SwiftBicValidator {
    // Method to trim outer whitespace and uppercase ASCII letters while retaining invalid internal characters.
    public static normalize(value: string): string {
        return value.trim().replace(/[a-z]/g, (letter) => letter.toUpperCase());
    }

    // Method to validate a Swift-issued BIC's syntax, without claiming the bank or account exists.
    public static validate(value: string): string {
        const text = this.normalize(value);

        if (!/^[A-Z0-9]+$/.test(text)) {
            return "validation_bic_characters_text";
        }

        if (text.length !== 8 && text.length !== 11) {
            return "validation_bic_length_text";
        }

        // Bank: four letters; country: two letters; location: two characters; branch: optional three.
        return /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(text) ? "" : "validation_bic_structure_text";
    }
}

export default SwiftBicValidator;

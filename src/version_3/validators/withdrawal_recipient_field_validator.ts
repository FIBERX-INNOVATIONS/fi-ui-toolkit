import IbanValidator from "./iban_validator";
import SwiftBicValidator from "./swift_bic_validator";
import InputValidatorUtil from "../utils/input_validator_util";

import type {
    RecipientFieldKeyType,
    RecipientFieldInterface,
    RecipientValidationResultInterface
} from "../types/withdrawal_recipient_form_type";

class WithdrawalRecipientFieldValidator {
    // Method to identify fields with delayed errors and normalized banking identifiers.
    public static isBankIdentifier(key: RecipientFieldKeyType): boolean {
        return key === "iban" || key === "swift_code";
    }

    // Method to normalize banking identifiers for validation and payloads without altering other field values.
    public static normalize(key: RecipientFieldKeyType, value: string): string {
        if (key === "iban") {
            return IbanValidator.normalize(value);
        }

        return key === "swift_code" ? SwiftBicValidator.normalize(value) : value;
    }

    // Method to present readable identifiers after blur without changing their submitted representation.
    public static format(key: RecipientFieldKeyType, value: string): string {
        return key === "iban" ? IbanValidator.format(value) : this.normalize(key, value);
    }

    // Method to apply common rules to every configured input and specialized rules to IBAN and BIC.
    public static validate(
        value: string | null | undefined,
        field: RecipientFieldInterface,
        is_stored = false
    ): RecipientValidationResultInterface {
        // Omitted saved secrets remain valid on edit; explicitly cleared values are checked normally.
        if (value === undefined && is_stored) {
            return { status: true, msg: "" };
        }

        const text = this.normalize(field.key, String(value ?? "")).trim();

        // Empty optional identifiers bypass specialized validation.
        if (!text) {
            const msg = field.required ? "validation_required_text" : "";

            return { status: !msg, msg };
        }

        const msg = this.validateIdentifier(text, field) || this.validateRules(text, field);

        return { status: !msg, msg };
    }

    // Method to dispatch identifier checks while keeping the form controller free of banking rules.
    private static validateIdentifier(value: string, field: RecipientFieldInterface): string {
        if (field.key === "iban") {
            return IbanValidator.validate(value, field.allowed_countries);
        }

        return field.key === "swift_code" ? SwiftBicValidator.validate(value) : "";
    }

    // Method to validate ordinary text, numeric and selection inputs against their currency profile.
    private static validateRules(value: string, field: RecipientFieldInterface): string {
        if ((field.control === "number" || field.digits) && !InputValidatorUtil.isDigit(value)) {
            return "validation_digits_text";
        }

        if (field.digits && value.length !== field.digits) {
            return "validation_digit_count_text";
        }

        if (field.max_length && value.length > field.max_length) {
            return "validation_max_length_text";
        }

        return field.options && !field.options.includes(value) ? "validation_option_text" : "";
    }
}

export default WithdrawalRecipientFieldValidator;

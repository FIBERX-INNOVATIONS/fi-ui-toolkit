import type {
    RecipientFieldInterface,
    RecipientFormValuesType,
    RecipientValidationResultInterface
} from "../types/withdrawal_recipient_form_type";

import FieldValidator from "../validators/withdrawal_recipient_field_validator";

class WithdrawalRecipientFormUtil {
    // Method to validate currently visible fields while allowing unchanged stored sensitive values.
    public static validateFormFields(
        values: RecipientFormValuesType,
        fields: RecipientFieldInterface[],
        stored_fields: string[]
    ): boolean {
        return fields.every((field) => {
            return this.validateField(values[field.key], field, stored_fields.includes(field.key)).status;
        });
    }

    // Method to report a specific default validation failure for one input.
    public static validateField(
        value: string | null | undefined,
        field: RecipientFieldInterface,
        is_stored = false
    ): RecipientValidationResultInterface {
        return FieldValidator.validate(value, field, is_stored);
    }

    // Method to create a PATCH payload without turning masked or untouched fields into destination changes.
    public static buildFormPayload(
        values: RecipientFormValuesType,
        initial: RecipientFormValuesType,
        fields: RecipientFieldInterface[],
        is_edit: boolean
    ): RecipientFormValuesType {
        const payload: RecipientFormValuesType = {};

        const keys = new Set([
            ...fields.map((field) => {
                return field.key;
            }),
            "currency_id",
            "account_holder_type",
            "recipient_type",
            "bank_account_scope"
        ] as const);

        for (const key of keys) {
            // Normalize both sides so presentation-only edits do not produce a PATCH.
            const raw_value = values[key];
            const value = typeof raw_value === "string" ? FieldValidator.normalize(key, raw_value) : raw_value;
            const original = initial[key];
            const initial_value = typeof original === "string" ? FieldValidator.normalize(key, original) : original;

            if (value !== undefined && (!is_edit || value !== initial_value)) {
                payload[key] = value === "" ? null : value;
            }
        }

        return payload;
    }
}
export default WithdrawalRecipientFormUtil;

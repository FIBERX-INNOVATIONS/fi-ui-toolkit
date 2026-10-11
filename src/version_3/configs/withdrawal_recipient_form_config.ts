import type { RecipientRenderingSchemaType } from "../types/withdrawal_recipient_form_type";

// See docs/withdrawal_recipient_form.md for overrides, callback contracts and field rules.
// Currency keys select a profile; "*" is used only as a fallback for crypto currencies.
export const RECIPIENT_RENDERING_SCHEMA: RecipientRenderingSchemaType = {
    NGN: {
        // Resolve automatically after a bank code and exactly ten account digits are entered.
        account_resolution: {
            enabled: true,
            bank_identifier: "bank_code",
            account_number_digits: 10,
            debounce_ms: 350
        },
        // Holder values match the API; labels remain configurable through content_props.
        holder_selector: {
            control: "select",
            label_key: "account_holder_type_text",
            options: {
                personal: { label_key: "individual_text" },
                business: { label_key: "corporate_text" }
            }
        },

        recipient_type: "bank_account",

        fields: [{ key: "description", control: "textarea", max_length: 500 }],

        // Choose the category before rendering its fields; select, radio and tabs are supported.
        category_selector: {
            field: "bank_account_scope",
            control: "select",
            label_key: "bank_account_scope_text",
            options: {
                local: {
                    label_key: "local_text",
                    description_key: "local_hint_text",
                    fields: [
                        { key: "bank_code", control: "select", source: "banks", required: true },

                        { key: "account_number", control: "number", required: true, sensitive: true, digits: 10 },

                        {
                            key: "account_name",
                            control: "text",
                            read_only: true,
                            required: true,
                            max_length: 200,
                            help_key: "resolved_name_hint_text"
                        },
                        { key: "bank_account_type", control: "select", required: true, options: ["current", "savings"] }
                    ]
                },

                international: {
                    label_key: "international_text",

                    description_key: "international_hint_text",

                    fields: [
                        { key: "bank_code", control: "select", source: "banks", required: true },
                        { key: "account_number", control: "number", required: true, sensitive: true, digits: 10 },
                        {
                            key: "account_name",
                            control: "text",
                            read_only: true,
                            required: true,
                            max_length: 200,
                            help_key: "resolved_name_hint_text"
                        },
                        {
                            key: "bank_account_type",
                            control: "select",
                            required: true,
                            options: ["current", "savings"]
                        },
                        // Nigerian accounts use NUBAN; an IBAN must not block this destination profile.
                        { key: "iban", control: "text", required: false, sensitive: true, max_length: 34 },
                        { key: "swift_code", control: "text", required: true, sensitive: true, max_length: 11 }
                    ]
                }
            }
        }
    },

    GBP: {
        // Ready for future support; disabled currencies never invoke the resolver.
        account_resolution: { enabled: false, bank_identifier: "sort_code", account_number_digits: 8 },
        // Holder values match the API; labels remain configurable through content_props.
        holder_selector: {
            control: "select",
            label_key: "account_holder_type_text",
            options: { personal: { label_key: "individual_text" }, business: { label_key: "corporate_text" } }
        },

        recipient_type: "bank_account",

        fields: [{ key: "description", control: "textarea", max_length: 500 }],

        // Choose the category before rendering its fields; select, radio and tabs are supported.
        category_selector: {
            field: "bank_account_scope",
            control: "select",
            label_key: "bank_account_scope_text",
            options: {
                local: {
                    label_key: "local_text",
                    description_key: "local_hint_text",
                    fields: [
                        { key: "bank_name", control: "text", required: true, max_length: 200 },
                        { key: "account_name", control: "text", required: true, max_length: 200 },
                        { key: "account_number", control: "number", required: true, sensitive: true, max_length: 34 },
                        { key: "sort_code", control: "number", required: true, sensitive: true, digits: 6 },
                        {
                            key: "bank_account_type",
                            control: "select",
                            required: true,
                            options: ["checking", "savings"],
                            option_label_keys: { checking: "current_text" }
                        }
                    ]
                },
                international: {
                    label_key: "international_text",
                    description_key: "international_hint_text",
                    fields: [
                        { key: "bank_name", control: "text", required: true, max_length: 200 },
                        { key: "account_name", control: "text", required: true, max_length: 200 },
                        { key: "account_number", control: "text", required: true, sensitive: true, max_length: 34 },
                        { key: "sort_code", control: "number", required: false, sensitive: true, digits: 6 },
                        { key: "iban", control: "text", required: true, sensitive: true, max_length: 34 },
                        { key: "swift_code", control: "text", required: true, sensitive: true, max_length: 11 },
                        {
                            key: "bank_account_type",
                            control: "select",
                            required: true,
                            options: ["checking", "savings"],
                            option_label_keys: { checking: "current_text" }
                        }
                    ]
                }
            }
        }
    },

    USD: {
        account_resolution: { enabled: false, bank_identifier: "routing_number", account_number_digits: 10 },
        // Holder values match the API; labels remain configurable through content_props.
        holder_selector: {
            control: "select",
            label_key: "account_holder_type_text",
            options: { personal: { label_key: "individual_text" }, business: { label_key: "corporate_text" } }
        },
        recipient_type: "bank_account",
        fields: [{ key: "description", control: "textarea", max_length: 500 }],
        // Choose the category before rendering its fields; select, radio and tabs are supported.
        category_selector: {
            field: "bank_account_scope",
            control: "select",
            label_key: "bank_account_scope_text",
            options: {
                local: {
                    label_key: "local_text",
                    description_key: "local_hint_text",
                    fields: [
                        { key: "bank_name", control: "text", required: true, max_length: 200 },
                        { key: "account_name", control: "text", required: true, max_length: 200 },
                        { key: "account_number", control: "number", required: true, sensitive: true, max_length: 34 },
                        { key: "routing_number", control: "number", required: true, sensitive: true, digits: 9 },
                        {
                            key: "bank_account_type",
                            control: "select",
                            required: true,
                            options: ["checking", "savings"]
                        }
                    ]
                },
                international: {
                    label_key: "international_text",
                    description_key: "international_hint_text",
                    fields: [
                        { key: "bank_name", control: "text", required: true, max_length: 200 },
                        { key: "account_name", control: "text", required: true, max_length: 200 },
                        { key: "account_number", control: "text", required: true, sensitive: true, max_length: 34 },
                        { key: "swift_code", control: "text", required: true, sensitive: true, max_length: 11 },
                        {
                            key: "bank_account_type",
                            control: "select",
                            required: true,
                            options: ["checking", "savings"]
                        }
                    ]
                }
            }
        }
    },

    "*": {
        // Holder values match the API; labels remain configurable through content_props.
        holder_selector: {
            control: "select",
            label_key: "account_holder_type_text",
            options: { personal: { label_key: "individual_text" }, business: { label_key: "corporate_text" } }
        },

        recipient_type: "crypto_wallet",

        fields: [
            { key: "wallet_address", control: "text", required: true, sensitive: true, max_length: 250 },
            { key: "network", control: "select", source: "networks", required: true },
            { key: "address_tag", control: "text", sensitive: true, max_length: 250 },
            { key: "description", control: "textarea", max_length: 500 }
        ]
    }
};

// Standalone validation copy; host content_props may replace any message.
export const RECIPIENT_VALIDATION_CONTENT: Record<string, string> = {
    validation_iban_characters_text: "IBAN must contain only letters A–Z and digits 0–9.",
    validation_iban_structure_text: "IBAN must start with two country letters and two check digits.",
    validation_iban_country_text: "Enter an IBAN with a recognised country code.",
    validation_iban_route_text: "This IBAN country is not supported for this withdrawal route.",
    validation_iban_length_text: "IBAN length does not match its country. Check the complete account number.",
    validation_iban_checksum_text: "IBAN checksum is invalid. Check the account number.",
    validation_bic_characters_text: "SWIFT/BIC must contain only letters A–Z and digits 0–9.",
    validation_bic_length_text: "SWIFT/BIC must contain 8 or 11 characters.",
    validation_bic_structure_text:
        "Enter a valid SWIFT/BIC: four bank letters, two country letters, a two-character location and an optional three-character branch.",

    validation_required_text: "This field is required.",
    validation_digits_text: "Enter digits only.",
    validation_digit_count_text: "Enter exactly {{digits}} digits.",
    validation_max_length_text: "Enter no more than {{max_length}} characters.",
    validation_option_text: "Select a valid option.",
    validation_invalid_text: "Enter a valid value.",
    validation_failed_text: "We could not validate this value. Please edit it and try again."
};

export type RecipientFieldKeyType =
    | "currency_id"
    | "account_holder_type"
    | "bank_account_scope"
    | "recipient_type"
    | "bank_account_type"
    | "account_name"
    | "account_number"
    | "bank_name"
    | "bank_code"
    | "branch_code"
    | "sort_code"
    | "routing_number"
    | "iban"
    | "swift_code"
    | "wallet_address"
    | "network"
    | "address_tag"
    | "description";
export type RecipientFormValuesType = Partial<Record<RecipientFieldKeyType, string | null>>;
export interface RecipientCurrencyInterface {
    code: string;
    name: string;
    is_fiat: boolean;
    networks?: string[];
}
export interface RecipientBankInterface {
    code: string;
    name: string;
}
export interface RecipientFieldRulesInterface {
    label_key?: string;
    placeholder_key?: string;
    help_key?: string;
    source?: "banks" | "networks";
    read_only?: boolean;
    required?: boolean;
    sensitive?: boolean;
    options?: string[];
    option_label_keys?: Record<string, string>;
    // Optional uppercase IBAN country allowlist for this payout route; omission allows registry countries.
    allowed_countries?: string[];

    max_length?: number;
    digits?: number;
}
// Bank inputs have a deliberately narrower range than ordinary destination fields.
export type RecipientFieldInterface = RecipientFieldRulesInterface &
    (
        | { key: "bank_name" | "bank_code"; control?: "select" | "text" }
        | {
              key: Exclude<RecipientFieldKeyType, "bank_name" | "bank_code">;
              control?: "text" | "number" | "select" | "select_search" | "textarea";
          }
    );
export interface RecipientCategoryInterface {
    label_key: string;
    description_key?: string;
    fields: RecipientFieldInterface[];
}
// Choice selectors intentionally support only these three presentations.
export type RecipientChoiceControlType = "select" | "radio" | "tabs";
export interface RecipientHolderSelectorInterface {
    control: RecipientChoiceControlType;
    label_key: string;
    options: Record<string, { label_key: string }>;
}
export type RecipientBankIdentifierType =
    "bank_code" | "bank_name" | "sort_code" | "branch_code" | "routing_number" | "swift_code";
export interface RecipientAccountResolutionInterface {
    enabled: boolean;
    bank_identifier: RecipientBankIdentifierType;
    account_number_digits: number;
    debounce_ms?: number;
}
export type RecipientResolveAccountInputType = {
    currency_code: string;
    account_number: string;
} & Partial<Record<RecipientBankIdentifierType, string>>;

export interface RecipientProfileInterface {
    account_resolution?: RecipientAccountResolutionInterface;
    holder_selector?: RecipientHolderSelectorInterface;
    recipient_type: "bank_account" | "crypto_wallet";
    fields: RecipientFieldInterface[];
    category_selector?: {
        field: "bank_account_scope";
        control: RecipientChoiceControlType;
        label_key: string;
        options: Record<string, RecipientCategoryInterface>;
    };
}
// Serializable rendering rules; callbacks belong to action_props rather than this schema.
export type RecipientRenderingSchemaType = Record<string, RecipientProfileInterface>;

export interface RecipientValidationResultInterface {
    status: boolean;
    msg: string;
}
export interface RecipientValidatorContextInterface {
    field: RecipientFieldInterface;
    values: Readonly<RecipientFormValuesType>;
    default_result: RecipientValidationResultInterface;
}
export type RecipientFieldValidatorType = (
    value: string | null | undefined,
    context: RecipientValidatorContextInterface
) => RecipientValidationResultInterface | Promise<RecipientValidationResultInterface>;
export interface RecipientFormActionsInterface {
    validators?: Partial<Record<RecipientFieldKeyType, RecipientFieldValidatorType>>;
    load_currencies?: () => Promise<RecipientCurrencyInterface[]>;
    load_banks?: (currency_code: string) => Promise<RecipientBankInterface[]>;
    resolve_account?: (input: RecipientResolveAccountInputType) => Promise<{ account_name: string }>;
    submit?: (values: RecipientFormValuesType) => Promise<void>;
}

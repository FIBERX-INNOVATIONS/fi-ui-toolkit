import type { Component } from "vue";

import type { InputUIPropsInterface } from "./input_ui_type";

import type { ButtonUIPropsInterface, ButtonUIClassStylesInterface } from "./button_ui_type";

import type {
    DepositCurrencyInterface,
    DepositDetailsInterface,
    PaymentOptionInterface,
    TransactionIntentInterface
} from "../types/deposit_flow_type";

export interface PaymentStepContentInterface {
    title_text: string;
    subtitle_text: string;
    currency_label_text: string;
    amount_label_text: string;
    description_label_text: string;
    next_btn_text: string;
    back_btn_text: string;
    empty_text: string;
    invalid_text: string;
    invalid_amount_input_text: string;
    fee_label_text: string;
    net_label_text: string;
    reference_label_text: string;
    review_note_text: string;
    search_text: string;
    selection_required_text: string;
    request_error_text: string;
}

export interface PaymentStepClassStylesInterface {
    wrapper: string;
    flow_wrapper: string;
    title: string;
    subtitle: string;
    field: string;
    label: string;
    error: string;
    options: string;
    option: string;
    radio: string;
    option_body: string;
    option_name: string;
    option_description: string;
    check: string;
    row: string;
    value: string;
    total: string;
    footer: string;
    button: ButtonUIClassStylesInterface;
    back_button: ButtonUIClassStylesInterface;
    input: InputUIPropsInterface["class_styles"];
}

export interface PaymentStepUIPropsInterface {
    id: string;
    content_props: PaymentStepContentInterface;
    class_styles: PaymentStepClassStylesInterface;
    currencies: DepositCurrencyInterface[];
    initial_values: DepositDetailsInterface;
    description_required: boolean;
    readonly_fields: (keyof DepositDetailsInterface)[];
    options: PaymentOptionInterface[];
    selected_id: string;
    intent: TransactionIntentInterface | null;
    is_loading: boolean;
    action_props: {
        on_details?: (details: DepositDetailsInterface) => Promise<void>;
        on_select?: (id: string) => Promise<void>;
        on_back?: () => void;
    };
}

export interface PaymentStepStateInterface {
    currency_code: string;
    amount: string;
    description: string;
    selected_id: string;
    error_text: string;
    is_submitting: boolean;
}

export interface PaymentStepComputedInterface {
    currency_input: InputUIPropsInterface;
    amount_input: InputUIPropsInterface;
    description_input: InputUIPropsInterface;
    next_button: ButtonUIPropsInterface;
    back_button: ButtonUIPropsInterface;
    review_rows: { label_text: string; value_text: string }[];
}

export interface PaymentStepComponentsInterface {
    InputUI: Component;
    ButtonUI: Component;
}

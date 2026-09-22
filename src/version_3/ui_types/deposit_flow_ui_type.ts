import type { ButtonUIPropsInterface } from "./button_ui_type";

import type { Component } from "vue";

import type {
    DepositActionsInterface,
    DepositStorageInterface,
    DepositCurrencyInterface,
    DepositDetailsInterface,
    PaymentOptionInterface,
    TransactionIntentInterface,
    DepositCacheInterface
} from "../types/deposit_flow_type";

import type {
    PaymentStepUIPropsInterface,
    PaymentStepContentInterface,
    PaymentStepClassStylesInterface
} from "./payment_step_ui_type";

export interface DepositFlowContentInterface extends PaymentStepContentInterface {
    details_subtitle_text?: string;
    provider_subtitle_text?: string;
    method_subtitle_text?: string;
    review_subtitle_text?: string;
    details_title_text: string;
    provider_title_text: string;
    method_title_text: string;
    review_title_text: string;
    loading_text: string;
    retry_text: string;
    request_error_text: string;
    storage_error_text: string;
    update_unavailable_text: string;
    provisioning_unavailable_text: string;
}

export interface DepositFlowUIPropsInterface {
    id: string;
    currencies: DepositCurrencyInterface[];
    initial_values: DepositDetailsInterface;
    description_required: boolean;
    readonly_fields: PaymentStepUIPropsInterface["readonly_fields"];
    content_props: DepositFlowContentInterface;
    class_styles: PaymentStepClassStylesInterface;
    action_props: DepositActionsInterface;
    storage: DepositStorageInterface;
}

export interface DepositFlowStateInterface {
    step: "details" | "provider" | "method" | "review";
    currencies: DepositCurrencyInterface[];
    details: DepositDetailsInterface;
    providers: PaymentOptionInterface[];
    methods: PaymentOptionInterface[];
    provider_id: string;
    method_id: string;
    intent: TransactionIntentInterface | null;
    is_loading: boolean;
    is_ready: boolean;
    error_text: string;
    cache: DepositCacheInterface;
}

export interface DepositFlowComputedInterface {
    step_props: PaymentStepUIPropsInterface;
    retry_button: ButtonUIPropsInterface;
}

export interface DepositFlowComponentsInterface {
    ButtonUI: Component;
    DepositDetailsUI: Component;
    PaymentOptionPickerUI: Component;
    TransactionIntentReviewUI: Component;
}

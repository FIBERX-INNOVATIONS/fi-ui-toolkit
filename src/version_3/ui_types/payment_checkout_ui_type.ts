import type { Component } from "vue";
import type { ButtonUIPropsInterface, ButtonUIClassStylesInterface } from "./button_ui_type";
import type {
    PaymentCheckoutConfigInterface,
    PaymentCheckoutTransactionInterface
} from "../types/payment_checkout_type";

export interface PaymentCheckoutContentInterface {
    title_text: string;
    subtitle_text: string;
    open_checkout_text: string;
    open_tab_text: string;
    refresh_text: string;
    new_deposit_text: string;
    reference_text: string;
    amount_text: string;
    account_number_text: string;
    account_name_text: string;
    bank_name_text: string;
    bank_code_text: string;
    wallet_address_text: string;
    network_text: string;
    memo_text: string;
    expires_at_text: string;
    redirect_text: string;
    bank_transfer_text: string;
    wallet_transfer_text: string;
    pending_text: string;
    review_text: string;
    expired_instructions_text: string;
    unsupported_text: string;
    no_action_text: string;
    success_text: string;
    failed_text: string;
    cancelled_text: string;
    expired_text: string;
    launch_error_text: string;
    frame_note_text: string;
    iframe_title_text: string;
}

export interface PaymentCheckoutClassStylesInterface {
    wrapper: string;
    title: string;
    subtitle: string;
    notice: string;
    error: string;
    rows: string;
    row: string;
    value: string;
    actions: string;
    link: string;
    iframe: string;
    button: ButtonUIClassStylesInterface;
}

export interface PaymentCheckoutUIPropsInterface {
    id: string;
    transaction: PaymentCheckoutTransactionInterface | null;
    is_loading: boolean;
    config: PaymentCheckoutConfigInterface;
    content_props: PaymentCheckoutContentInterface;
    class_styles: PaymentCheckoutClassStylesInterface;
    action_props: {
        on_refresh?: () => Promise<void>;
        on_new_deposit?: () => void;
    };
}

export interface PaymentCheckoutStateInterface {
    now: number;
    iframe_url: string;
    started_transaction_id: string;
    is_launching: boolean;
    error_text: string;
}

export interface PaymentCheckoutComputedInterface {
    message_text: string;
    rows: { label_text: string; value_text: string }[];
    checkout_link: string;
    can_launch: boolean;
    can_refresh: boolean;
    can_start_new: boolean;
    launch_button: ButtonUIPropsInterface;
    refresh_button: ButtonUIPropsInterface;
    new_deposit_button: ButtonUIPropsInterface;
}

export interface PaymentCheckoutComponentsInterface {
    ButtonUI: Component;
}

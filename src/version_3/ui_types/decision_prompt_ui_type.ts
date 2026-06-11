import { Component } from "vue";
import { ButtonUIClassStylesInterface, ButtonUIPropsInterface } from "./button_ui_type";

/* ---------------------------------- */
/* Action Return                      */
/* ---------------------------------- */

export interface DecisionPromptUIActionReturnInterface {
    status: boolean;
    msg: string;
    data?: Record<string, unknown>;
}

/* ---------------------------------- */
/* Action Props                       */
/* ---------------------------------- */

export interface DecisionPromptUIActionPropsInterface {
    on_confirm?: (
        reason_text?: string,
        event?: MouseEvent,
        config?: { props: DecisionPromptUIPropsInterface }
    ) => Promise<DecisionPromptUIActionReturnInterface | void>;

    on_cancel?: (
        event?: MouseEvent,
        config?: { props: DecisionPromptUIPropsInterface }
    ) => Promise<DecisionPromptUIActionReturnInterface | void>;
}

/* ---------------------------------- */
/* Boolean Props                      */
/* ---------------------------------- */

export interface DecisionPromptUIBooleanPropsInterface {
    show_reason_input?: boolean;
    reason_required?: boolean;
}

/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

export interface DecisionPromptUIClassStylesInterface {
    wrapper_class_style: string;

    content_wrapper_class_style: string;

    title_class_style: string;

    message_class_style: string;

    reason_wrapper_class_style: string;

    reason_label_class_style: string;

    reason_input_class_style: string;

    reason_helper_class_style: string;

    actions_wrapper_class_style: string;

    confirm_btn_class_style?: ButtonUIClassStylesInterface;

    cancel_btn_class_style?: ButtonUIClassStylesInterface;
}

/* ---------------------------------- */
/* Content Props                      */
/* ---------------------------------- */

export interface DecisionPromptUIContentPropsInterface {
    title_text?: string;
    message_text?: string;
    reason_label_text?: string;
    reason_placeholder_text?: string;
    reason_helper_text?: string;
}

/* ---------------------------------- */
/* Props Interface                    */
/* ---------------------------------- */

export interface DecisionPromptUIPropsInterface {
    content_props?: DecisionPromptUIContentPropsInterface;

    confirm_button_props?: ButtonUIPropsInterface;

    cancel_button_props?: ButtonUIPropsInterface;

    boolean_props?: DecisionPromptUIBooleanPropsInterface;

    action_props?: DecisionPromptUIActionPropsInterface;

    class_styles?: DecisionPromptUIClassStylesInterface;
}

/* ---------------------------------- */
/* State                              */
/* ---------------------------------- */

export interface DecisionPromptUIStateDataInterface {
    is_confirming: boolean;
    is_canceling: boolean;
    reason_text: string;
    error_text: string | null;
}

/* ---------------------------------- */
/* Computed                           */
/* ---------------------------------- */

export interface DecisionPromptUIComputedDataInterface {
    confirm_button_disabled: boolean;
    cancel_button_disabled: boolean;
    is_processing: boolean;
    show_reason_input: boolean;
    display_confirm_button_props: ButtonUIPropsInterface;
    display_cancel_button_props: ButtonUIPropsInterface;
}

/* ---------------------------------- */
/* Components                         */
/* ---------------------------------- */

export interface DecisionPromptUIComponentsInterface {
    ButtonUI: Component;
}

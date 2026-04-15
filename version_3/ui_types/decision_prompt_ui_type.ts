import { Component } from "vue";
import { ButtonUIClassStylesInterface, ButtonUIPropsInterface } from "./button_ui_type";

/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

export interface DecisionPromptUIClassStylesInterface {
    wrapper_class_style: string;

    content_wrapper_class_style: string;

    title_class_style: string;

    message_class_style: string;

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
}


/* ---------------------------------- */
/* Props Interface                    */
/* ---------------------------------- */

export interface DecisionPromptUIPropsInterface {

    content_props?: DecisionPromptUIContentPropsInterface;

    confirm_button_props?: ButtonUIPropsInterface;

    cancel_button_props?: ButtonUIPropsInterface;

    class_styles?: DecisionPromptUIClassStylesInterface;
}

/* ---------------------------------- */
/* State                              */
/* ---------------------------------- */

export interface DecisionPromptUIStateDataInterface {}

/* ---------------------------------- */
/* Computed                           */
/* ---------------------------------- */

export interface DecisionPromptUIComputedDataInterface {}

/* ---------------------------------- */
/* Components                         */
/* ---------------------------------- */

export interface DecisionPromptUIComponentsInterface {
    ButtonUI: Component;
}
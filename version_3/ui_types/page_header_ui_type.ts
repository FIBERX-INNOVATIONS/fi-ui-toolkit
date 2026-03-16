import { Component } from "vue";

import { HeaderTextUIClassStylesInterface, HeaderTextUIPropsInterface } from "./header_text_ui_type";
import { ButtonUIClassStylesInterface, ButtonUIPropsInterface } from "./button_ui_type";

/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

export interface PageHeaderUIClassStylesInterface {

    wrapper_class_style: string;

    top_row_class_style: string;

    header_wrapper_class_style: string;

    description_class_style: string;

    action_buttons_wrapper_class_style: string;

    header_text_class_styles?: HeaderTextUIClassStylesInterface;

    action_button_class_styles?: ButtonUIClassStylesInterface

}


/* ---------------------------------- */
/* Props Interface                    */
/* ---------------------------------- */

export interface PageHeaderUIPropsInterface {

    id?: string;

    header_props?: HeaderTextUIPropsInterface;

    description_text?: string;

    action_buttons?: ButtonUIPropsInterface[];

    class_styles?: PageHeaderUIClassStylesInterface;

}


/* ---------------------------------- */
/* State                              */
/* ---------------------------------- */

export interface PageHeaderUIStateDataInterface {
    initialized: boolean;
}


/* ---------------------------------- */
/* Computed                           */
/* ---------------------------------- */

export interface PageHeaderUIComputedDataInterface {

    has_actions: boolean;

    has_description: boolean;

}


/* ---------------------------------- */
/* Components                         */
/* ---------------------------------- */

export interface PageHeaderUIComponentsInterface {

    HeaderTextUI: Component;

    ButtonUI: Component;

}
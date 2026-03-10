import { Component } from "vue";

/* ---------------------------------- */
/* Button Type                        */
/* ---------------------------------- */

export type ButtonType =
    | "button"
    | "submit"
    | "reset";


/* ---------------------------------- */
/* Content Options                    */
/* ---------------------------------- */

export interface ButtonUIContentOptionsInterface {
    button_html_content?: string;

    loading_html_content?: string;
}


/* ---------------------------------- */
/* Boolean Props                      */
/* ---------------------------------- */

export interface ButtonUIBooleanPropsInterface {
    disabled?: boolean;
}


/* ---------------------------------- */
/* Action Return                      */
/* ---------------------------------- */

export interface ButtonActionMethodReturnInterface {
    status: boolean;
    msg: string;
    data?: Record<string, any>;
}


/* ---------------------------------- */
/* Action Props                       */
/* ---------------------------------- */

export interface ButtonUIActionPropsInterface {

    on_click?: (
        event?: MouseEvent,
        config?: { props: ButtonUIPropsInterface }
    ) => Promise<ButtonActionMethodReturnInterface>;

    on_hover?: (
        event?: MouseEvent,
        config?: { props: ButtonUIPropsInterface }
    ) => Promise<ButtonActionMethodReturnInterface>;

}


/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

export interface ButtonUIClassStylesInterface {

    button_class_style: string;

    disabled_class_style: string;

    loading_class_style: string;

    wrapper_class_style: string;

    icon_class_style: string;

    text_class_style: string;

}


/* ---------------------------------- */
/* Props Interface                    */
/* ---------------------------------- */

export interface ButtonUIPropsInterface {

    id?: string;

    type?: ButtonType;

    content_props?: ButtonUIContentOptionsInterface;

    boolean_props?: ButtonUIBooleanPropsInterface;

    action_props?: ButtonUIActionPropsInterface;

    class_styles?: ButtonUIClassStylesInterface;

}


/* ---------------------------------- */
/* State Interface                    */
/* ---------------------------------- */

export interface ButtonUIStateDataInterface {

    is_loading: boolean;

}


/* ---------------------------------- */
/* Computed                           */
/* ---------------------------------- */

export interface ButtonUIComputedDataInterface {

    is_disabled: boolean;

}


/* ---------------------------------- */
/* Components                         */
/* ---------------------------------- */

export interface ButtonUIComponentsInterface {}

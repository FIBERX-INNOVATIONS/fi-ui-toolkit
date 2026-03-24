import { Component } from "vue";
import { SVGIconKey } from "../resources/svg_icon_resource";
import { OverlayUIPropsInterface } from "./overlay_ui_type";

/* ---------------------------------- */
/* Modal Animation                    */
/* ---------------------------------- */

export type ModalAnimationType =
    | "fade"
    | "slide_left"
    | "slide_right"
    | "slide_top"
    | "slide_bottom"
    | "scale";


/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

export interface ModalUIClassStylesInterface {

    wrapper_class_style: string;

    modal_class_style: string;

    header_class_style: string;

    header_title_wrapper_class_style: string;

    header_title_class_style: string;

    header_title_img_icon_class_style: string;

    header_close_btn_wrapper_class_style: string;

    close_btn_class_style: string;

    body_class_style: string;

    footer_class_style: string;

}


/* ---------------------------------- */
/* Action Return                      */
/* ---------------------------------- */

export interface ModalUIActionReturnInterface {

    status: boolean;

    msg: string;

    data?: Record<string, any>;

}

/* ---------------------------------- */
/* Content Props                      */
/* ---------------------------------- */
export interface ModalUIContentPropsInterface {
    close_btn_content?: string;

    close_btn_icon_key?: SVGIconKey;

}


/* ---------------------------------- */
/* Action Props                       */
/* ---------------------------------- */

export interface ModalUIActionPropsInterface {

    on_close?: (
        event?: MouseEvent,
        config?: { props: ModalUIPropsInterface }
    ) => Promise<ModalUIActionReturnInterface | void>;

}



/* ---------------------------------- */
/* Props Interface                    */
/* ---------------------------------- */

export interface ModalUIPropsInterface {

    overlay_props?: OverlayUIPropsInterface;

    title_text?: string;

    title_icon?: SVGIconKey | null;

    title_img?: string;

    animation_type?: ModalAnimationType;

    layer?: number;

    content_props?: ModalUIContentPropsInterface;

    action_props?: ModalUIActionPropsInterface;

    class_styles?: ModalUIClassStylesInterface;

}


/* ---------------------------------- */
/* State                              */
/* ---------------------------------- */

export interface ModalUIStateDataInterface {

    is_visible: boolean;

}


/* ---------------------------------- */
/* Computed                           */
/* ---------------------------------- */

export interface ModalUIComputedDataInterface {

    transition_name: string;

    z_index_style: Record<string, string>;

}


/* ---------------------------------- */
/* Components                         */
/* ---------------------------------- */

export interface ModalUIComponentsInterface {

    LayoutSectionsUI: Component;

    OverlayUI: Component;

}

export interface ModalUIPropsExtendedInterface<
    BodyProps extends Record<string, any> = Record<string, any>,
    FooterProps extends Record<string, any> = Record<string, any>
> extends ModalUIPropsInterface {
    body_component?: Component;

    footer_component?: Component;

    body_props?: BodyProps;

    footer_props?: FooterProps;
}

export interface ConfigureDefaultModalPropsBuilderInterface {
    class_styles?: ModalUIClassStylesInterface;

    default_overlay_props?: OverlayUIPropsInterface;

    default_action_props?: ModalUIActionPropsInterface;

    default_animation_type?: ModalAnimationType;

    default_content_props?: ModalUIContentPropsInterface;
}

export interface ModalUIContentPayloadInterface {
    title_text: string;
    title_icon: SVGIconKey;
    title_img: string;
}
import { Component } from "vue";
import { SVGIconKey } from "../resources/svg_icon_resource";

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
/* Action Props                       */
/* ---------------------------------- */

export interface ModalUIActionPropsInterface {

    on_close?: (
        event?: MouseEvent,
        config?: { props: ModalUIPropsInterface }
    ) => Promise<ModalUIActionReturnInterface>;

}


/* ---------------------------------- */
/* Props Interface                    */
/* ---------------------------------- */

export interface ModalUIPropsInterface {

    id?: string;

    overlay_id?: string;

    title_text?: string;

    title_icon?: SVGIconKey | null;

    title_img?: string;

    animation_type?: ModalAnimationType;

    layer?: number;

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
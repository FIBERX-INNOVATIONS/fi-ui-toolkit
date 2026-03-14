import { Component } from "vue";

/* ---------------------------------- */
/* Action Return                      */
/* ---------------------------------- */

export interface OverlayUIActionReturnInterface {

    status: boolean;

    msg: string;

    data?: Record<string, any>;

}


/* ---------------------------------- */
/* Action Props                       */
/* ---------------------------------- */

export interface OverlayUIActionPropsInterface {

    on_open?: (
        config?: { props: OverlayUIPropsInterface }
    ) => Promise<OverlayUIActionReturnInterface>;

    on_close?: (
        config?: { props: OverlayUIPropsInterface }
    ) => Promise<OverlayUIActionReturnInterface>;

    on_overlay_click?: (
        event?: MouseEvent,
        config?: { props: OverlayUIPropsInterface }
    ) => Promise<OverlayUIActionReturnInterface>;

}


/* ---------------------------------- */
/* Boolean Props                      */
/* ---------------------------------- */

export interface OverlayUIBooleanPropsInterface {

    close_on_overlay_click?: boolean;

    lock_scroll?: boolean;

}


/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

export interface OverlayUIClassStylesInterface {

    wrapper_class_style: string;

    overlay_class_style: string;

    content_wrapper_class_style: string;

}


/* ---------------------------------- */
/* Props Interface                    */
/* ---------------------------------- */

export interface OverlayUIPropsInterface {

    id?: string;

    model_value?: boolean;

    boolean_props?: OverlayUIBooleanPropsInterface;

    action_props?: OverlayUIActionPropsInterface;

    class_styles?: OverlayUIClassStylesInterface;

}


/* ---------------------------------- */
/* State                              */
/* ---------------------------------- */

export interface OverlayUIStateDataInterface {

    is_open: boolean;

}


/* ---------------------------------- */
/* Computed                           */
/* ---------------------------------- */

export interface OverlayUIComputedDataInterface {

    show_overlay: boolean;

}


/* ---------------------------------- */
/* Components                         */
/* ---------------------------------- */

export interface OverlayUIComponentsInterface {}
import { Component } from "vue";

/* ---------------------------------- */
/* Action Return                      */
/* ---------------------------------- */

export interface ImageRenderActionReturnInterface {
    status: boolean;
    msg: string;
    data?: Record<string, any>;
}


/* ---------------------------------- */
/* Action Props                       */
/* ---------------------------------- */

export interface ImageRenderUIActionPropsInterface {

    on_click?: (
        event?: MouseEvent,
        config?: { props: ImageRenderUIPropsInterface }
    ) => Promise<ImageRenderActionReturnInterface | void>;

}


/* ---------------------------------- */
/* Boolean Props                      */
/* ---------------------------------- */

export interface ImageRenderUIBooleanPropsInterface {

    lazy_load?: boolean;

}


/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

export interface ImageRenderUIClassStylesInterface {

    wrapper_class_style: string;

    image_class_style: string;

    content_wrapper_class_style: string;

    loading_class_style: string;

    error_class_style: string;

}


/* ---------------------------------- */
/* Props Interface                    */
/* ---------------------------------- */

export interface ImageRenderUIPropsInterface {

    id?: string;

    src?: string;

    alt_text?: string;

    content?: string;

    boolean_props?: ImageRenderUIBooleanPropsInterface;

    action_props?: ImageRenderUIActionPropsInterface;

    class_styles?: ImageRenderUIClassStylesInterface;

}


/* ---------------------------------- */
/* State                              */
/* ---------------------------------- */

export interface ImageRenderUIStateDataInterface {

    is_loading: boolean;

    has_error: boolean;

}


/* ---------------------------------- */
/* Computed                           */
/* ---------------------------------- */

export interface ImageRenderUIComputedDataInterface {

    show_image: boolean;

}


/* ---------------------------------- */
/* Components                         */
/* ---------------------------------- */

export interface ImageRenderUIComponentsInterface {
    ImgComponent: Component;
}

export interface ImagePayloadInterface {
    img_link: string;
    img_alt_text?: string;
}
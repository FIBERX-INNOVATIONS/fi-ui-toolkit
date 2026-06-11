import { Component } from "vue";

import { SVGIconKey } from "../resources/svg_icon_resource";

/* ---------------------------------- */
/* Media Type                         */
/* ---------------------------------- */

export type ContentCardUIMediaType = "image" | "video";

export type ContentCardUITitleIconPositionType = "before" | "after";

/* ---------------------------------- */
/* Action Return                      */
/* ---------------------------------- */

export interface ContentCardUIActionMethodReturnInterface {
    status: boolean;
    msg: string;
    data?: Record<string, unknown>;
}

/* ---------------------------------- */
/* Action Props                       */
/* ---------------------------------- */

export interface ContentCardUIActionPropsInterface {
    on_click?: (
        title_text?: string,
        media_link?: string,
        description_text?: string,
        event?: MouseEvent,
        config?: { props: ContentCardUIPropsInterface }
    ) => Promise<ContentCardUIActionMethodReturnInterface | void>;
}

/* ---------------------------------- */
/* Content Props                      */
/* ---------------------------------- */

export interface ContentCardUIContentPropsInterface {
    title_text?: string;
    title_icon?: SVGIconKey;
    title_icon_position?: ContentCardUITitleIconPositionType;
    description_text?: string;
    media_link?: string;
    media_description_text?: string;
    button_text?: string;
    button_icon?: SVGIconKey;
}

/* ---------------------------------- */
/* Content Path Props                 */
/* ---------------------------------- */

export interface ContentCardUIContentPathPropsInterface {
    title_text?: string;
    title_icon?: string;
    description_text?: string;
    media_link?: string;
    media_description_text?: string;
    button_text?: string;
    button_icon?: string;
}

/* ---------------------------------- */
/* Data Props                         */
/* ---------------------------------- */

export interface ContentCardUIDataPropsInterface {
    media_type?: ContentCardUIMediaType;
}

/* ---------------------------------- */
/* Boolean Props                      */
/* ---------------------------------- */

export interface ContentCardUIBooleanPropsInterface {
    disabled?: boolean;
    lazy_load?: boolean;
    video_controls?: boolean;
}

/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

export interface ContentCardUIClassStylesInterface {
    wrapper_class_style: string;
    header_class_style: string;
    title_class_style: string;
    title_icon_class_style: string;
    title_text_class_style: string;
    media_wrapper_class_style: string;
    media_class_style: string;
    media_description_class_style: string;
    body_class_style: string;
    description_class_style: string;
    actions_class_style: string;
    button_class_style: string;
    button_disabled_class_style: string;
    button_loading_class_style: string;
    button_icon_class_style: string;
    button_text_class_style: string;
    error_class_style: string;
}

/* ---------------------------------- */
/* Props Interface                    */
/* ---------------------------------- */

export interface ContentCardUIPropsInterface {
    id?: string;
    content_props?: ContentCardUIContentPropsInterface;
    data_props?: ContentCardUIDataPropsInterface;
    boolean_props?: ContentCardUIBooleanPropsInterface;
    action_props?: ContentCardUIActionPropsInterface;
    class_styles?: ContentCardUIClassStylesInterface;
}

/* ---------------------------------- */
/* State                              */
/* ---------------------------------- */

export interface ContentCardUIStateDataInterface {
    is_loading: boolean;
    has_media_error: boolean;
    error_text: string | null;
}

/* ---------------------------------- */
/* Computed                           */
/* ---------------------------------- */

export interface ContentCardUIComputedDataInterface {
    has_title: boolean;
    title_icon_is_after: boolean;
    has_media: boolean;
    is_video_media: boolean;
    has_media_description: boolean;
    has_description: boolean;
    has_action: boolean;
    is_action_disabled: boolean;
    action_button_class: string;
}

/* ---------------------------------- */
/* Components                         */
/* ---------------------------------- */

export interface ContentCardUIComponentsInterface {
    ImgComponent: Component;
    VideoComponent: Component;
}

import { SVGIconKey } from "../resources/svg_icon_resource";
import { ButtonUIPropsInterface } from "../ui_types/button_ui_type";

/* ---------------------------------- */
/* Layout                             */
/* ---------------------------------- */

export type PaginationLayoutType =
    | "center"
    | "left"
    | "right";

/* ---------------------------------- */
/* Content Props                      */
/* ---------------------------------- */

export interface PaginationUIContentPropsInterface {
    prev_btn_icon?: SVGIconKey;
    next_btn_icon?: SVGIconKey;
    prev_btn_text?: string;
    next_btn_text?: string;
}

/* ---------------------------------- */
/* Data Props                         */
/* ---------------------------------- */

export interface PaginationUIDataPropsInterface {
    current_page: number;
    total_pages: number;
}

/* ---------------------------------- */
/* Config Props                       */
/* ---------------------------------- */

export interface PaginationUIConfigPropsInterface {
    show_numbers?: boolean;
    max_visible_pages?: number;
}

/* ---------------------------------- */
/* Action Props                       */
/* ---------------------------------- */

export interface PaginationUIActionPropsInterface {
    on_page_change?: (page: number) => Promise<void> | void;
}

/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

export interface PaginationUIClassStylesInterface {
    wrapper_class_style: string;
    button_class_style: string;
    btn_icon_class_style: string;
    active_page_class_style: string;
    disabled_class_style: string;
    page_container_class_style: string;
    prev_btn_class_style?: string;
    next_btn_class_style?: string;
}

/* ---------------------------------- */
/* Props Interface                    */
/* ---------------------------------- */

export interface PaginationUIPropsInterface {
    id?: string;

    layout?: PaginationLayoutType;

    content_props?: PaginationUIContentPropsInterface;

    data_props: PaginationUIDataPropsInterface;

    config_props?: PaginationUIConfigPropsInterface;

    action_props?: PaginationUIActionPropsInterface;

    class_styles?: PaginationUIClassStylesInterface;
}

/* ---------------------------------- */
/* State                              */
/* ---------------------------------- */

export interface PaginationUIStateDataInterface {}

/* ---------------------------------- */
/* Computed                           */
/* ---------------------------------- */

export interface PaginationUIComputedDataInterface {
    pages: (number | string)[];
    is_prev_disabled: boolean;
    is_next_disabled: boolean;
}

/* ---------------------------------- */
/* Components                         */
/* ---------------------------------- */

export interface PaginationUIComponentsInterface {}

export interface PaginationUIBtnContentPayload {
    prev_btn_text: string;
    next_btn_text: string
}
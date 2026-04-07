/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

import { Component } from "vue";
import { DataTableColumnRenderType } from "./data_table_ui_type";
import { ImageRenderUIClassStylesInterface } from "./image_render_ui_type";
import { SVGIconValue } from "../resources/svg_icon_resource";
import { InputUIClassStylesInterface } from "./input_ui_type";
import { HeaderTextUIClassStylesInterface } from "./header_text_ui_type";

export interface DataTableCellComponentUIClassStylesInterface {
    wrapper_class_style: string;

    text_class_style?: string;

    img_render_ui_class_style?: ImageRenderUIClassStylesInterface;

    sub_text_class_style?: string;

    url_link_class_style?: {
        wrapper_class_style: string;

        icon_class_style: string;

        text_class_style: string;
    };

    input_ui_class_style?: InputUIClassStylesInterface;

    text_content_class_style?: HeaderTextUIClassStylesInterface;
}

/* ---------------------------------- */
/* Props                              */
/* ---------------------------------- */

export interface DataTableCellComponentUIPropsInterface<T = any> {
    record?: T;

    column?: DataTableColumnRenderType<T>;

    record_index?: number;
}

/* ---------------------------------- */
/* State                              */
/* ---------------------------------- */

export interface DataTableCellComponentUIStateDataInterface {}

/* ---------------------------------- */
/* Computed                           */
/* ---------------------------------- */

export interface DataTableCellComponentUIComputedDataInterface {
    raw_record_value?: string | number | boolean | object | null;

    serial_value?: string | number;

    img_src?: string;

    img_alt_text?: string;

    img_content?: string;

    img_sub_text?: string;

    link_url?: string;

    link_text?: string;

    link_icon?: SVGIconValue | string;

    text_content?: string;
}

/* ---------------------------------- */
/* Components                         */
/* ---------------------------------- */

export interface DataTableCellComponentUIComponentsInterface {

    ImageRenderUI: Component;

    SwitchInputUI: Component;

    HeaderTextUI: Component

}
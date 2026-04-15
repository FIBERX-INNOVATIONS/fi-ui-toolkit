import { Component } from "vue";
import { DataTableCellComponentUIClassStylesInterface } from "./data_table_cell_component_ui_type";

import { SVGIconKey } from "../resources/svg_icon_resource";

import { 
    InputUIActionPropsInterface, 
    InputUIBooleanPropsInterface, 
    InputUIContentOptionsInterface, 
    InputValue 
} from "./input_ui_type";

import { 
    HeaderTagType,
} from "./header_text_ui_type";

import { 
    ButtonUIActionPropsInterface, 
    ButtonUIBooleanPropsInterface, 
    ButtonUIContentOptionsInterface 
} from "./button_ui_type";

export interface DataTableUIActionPropsInterface<T = any> {
    on_sort?: (
        key: keyof T,
        direction: "asc" | "desc" | null,
        config?: { props: DataTableUIPropsInterface<T> }
    ) => Promise<void>;
};

/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

export interface DataTableUIClassStylesInterface {
    wrapper_class_style: string;
    table_class_style: string;
    thead_class_style: string;
    th_class_style: string;
    th_cell_wrapper_class_style: string;
    th_sort_icon_class_style: string;
    tbody_class_style: string;
    tr_class_style: string;
    td_class_style: string;
    sortable_header_wrapper_class_style?: string
    sortable_header_icon_class_style?: string;
    loading_section_wrapper_class_style: string;
    loader_text_wrapper_class_style: string;
    loader_text_icon_class_style: string;
    loader_skeleton_bar_class_style?: string;
    empty_data_wrapper_class_style: string;
    empty_data_class_style: string;
}


/* ---------------------------------- */
/* Cell Render Return Type            */
/* ---------------------------------- */

export type DataTableCellRenderReturnType =
    | string
    | number
    | null
    | Component;

/* ---------------------------------- */
/* Column Render Config               */
/* ---------------------------------- */

export interface DataTableColumnRenderType<T = any> {
    key: keyof T;

    sortable?: boolean;

    width?: string;

    /* HEADER RENDER */
    header?: {
        label_key?: string;
        render?: (col: DataTableColumnRenderType<T>) => DataTableCellRenderReturnType;
    };

    /* CELL RENDER */
    cell?: {
        render?: (row: T, index: number) => DataTableCellRenderReturnType;
        content_key?: string;
    };

    props?: {
        class_styles?: DataTableCellComponentUIClassStylesInterface;

        prefix?: string;

        suffix?: string;

        pad_start?: number;

        icon_key?: SVGIconKey;

        header_tag?: HeaderTagType;

        is_selected?: boolean;

        input_model_value?: (record: T, record_index?: number) => InputValue;

        input_content_props?: (record: T, record_index?: number) => InputUIContentOptionsInterface;

        input_ui_boolean_props?: (record: T, record_index?: number) => InputUIBooleanPropsInterface;

        input_action_props?: (record: T, record_index?: number) => InputUIActionPropsInterface;

        button_content_props?: (record: T, record_index?: number) => ButtonUIContentOptionsInterface;

        button_ui_boolean_props?: (record: T, record_index?: number) => ButtonUIBooleanPropsInterface;

        button_action_props?: (record: T, record_index?: number) => ButtonUIActionPropsInterface;

        getLinkURL?: (record: T, record_index?: number) => string;

        getLinkText?: (record: T, record_index?: number) => string;

        getImgSrc?: (record: T, record_index?: number) => string;

        getImgAltText?: (record: T, record_index?: number) => string;

        getImgContent?: (record: T, record_index?: number) => string;

        getImgSubText?: (record: T, record_index?: number) => string;

        getDateTextContent?: (record: T, record_index?: number) => string; 

        [key: string]: any;
    };
}

/* ---------------------------------- */
/* Content Props interface             */
/* ---------------------------------- */
export interface DataTableUIContentPropsInterface {
    loader_html_content?: string;

    empty_data_html_content?: string;

}

/* ---------------------------------- */
/* Props                              */
/* ---------------------------------- */

export interface DataTableUIPropsInterface<T = any> {
    section_id?: string;
    table_id?: string;

    table_render_obj: DataTableColumnRenderType<T>[];

    data: T[];

    row_key?: keyof T;

    class_styles?: DataTableUIClassStylesInterface;

    action_props?: DataTableUIActionPropsInterface<T>;

    is_loading?: boolean;

    content?: DataTableUIContentPropsInterface;
}

/* ---------------------------------- */
/* State                              */
/* ---------------------------------- */

export interface DataTableUIStateDataInterface<T = any> {
    loading: boolean;
    sort_key: keyof T | null;
    sort_direction: "asc" | "desc" | null;
}

/* ---------------------------------- */
/* Computed                           */
/* ---------------------------------- */

export interface DataTableUIComputedDataInterface<T = any> {}

/* ---------------------------------- */
/* Components                         */
/* ---------------------------------- */

export interface DataTableUIComponentsInterface { }

export interface DataTableUIBuilderConfig {
    section_id?: string;
    table_id?: string;
    class_styles?: DataTableUIClassStylesInterface;
    action_props?: DataTableUIActionPropsInterface;
    loader_html_content_key?: string;
    loader_html_content?: string;
    empty_data_html_content_key?: string;
    empty_data_html_content?: string;
}
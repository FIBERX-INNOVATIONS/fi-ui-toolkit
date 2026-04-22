import { Component } from "vue";
import { ButtonUIPropsInterface } from "../ui_types/button_ui_type";

/* ---------------------------------- */
/* Layout                             */
/* ---------------------------------- */

export type HeaderBarLayoutType =
    | "text-left"
    | "text-right"
    | "stacked-mobile";

/* ---------------------------------- */
/* Content Props                      */
/* ---------------------------------- */

export interface DataTableResultAndBulkActionBarUIContentPropsInterface {
    header_text_key?: string;
}

/* ---------------------------------- */
/* Data Props                         */
/* ---------------------------------- */

export interface DataTableResultAndBulkActionBarUIDataPropsInterface {
    total_records: number;
    filtered_records?: number;
    current_page: number;
    total_pages: number;
}

/* ---------------------------------- */
/* Selection Props                    */
/* ---------------------------------- */

export interface DataTableResultAndBulkActionBarUISelectionPropsInterface {
    selected_count?: number;
    show_bulk_button?: boolean;
    bulk_button_props?: ButtonUIPropsInterface;
}

/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

export interface DataTableResultAndBulkActionBarUIClassStylesInterface {
    wrapper_class_style: string;
    left_container_class_style: string;
    right_container_class_style: string;
    text_class_style: string;
}

/* ---------------------------------- */
/* Props Interface                    */
/* ---------------------------------- */

export interface DataTableResultAndBulkActionBarUIPropsInterface {
    id?: string;

    layout?: HeaderBarLayoutType;

    content_props?: DataTableResultAndBulkActionBarUIContentPropsInterface;

    data_props: DataTableResultAndBulkActionBarUIDataPropsInterface;

    selection_props?: DataTableResultAndBulkActionBarUISelectionPropsInterface;

    class_styles?: DataTableResultAndBulkActionBarUIClassStylesInterface;
}

/* ---------------------------------- */
/* State                              */
/* ---------------------------------- */

export interface DataTableResultAndBulkActionBarUIStateDataInterface {}

/* ---------------------------------- */
/* Computed                           */
/* ---------------------------------- */

export interface DataTableResultAndBulkActionBarUIComputedDataInterface {
    computed_header_text: string;
    show_bulk_button: boolean;
}

/* ---------------------------------- */
/* Components                         */
/* ---------------------------------- */

export interface DataTableResultAndBulkActionBarUIComponentsInterface {
    ButtonUI: Component;
}
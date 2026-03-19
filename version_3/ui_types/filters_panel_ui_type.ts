import { Component } from "vue";

import { InputGroupUIPropsInterface } from "./input_group_ui_type";
import { ButtonUIClassStylesInterface, ButtonUIPropsInterface } from "./button_ui_type";


/* ---------------------------------- */
/* Filter Config                      */
/* ---------------------------------- */

export interface FilterFieldConfigInterface {

    key: string;

    input_group_props: InputGroupUIPropsInterface;

}


/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

export interface FiltersPanelUIClassStylesInterface {

    wrapper_class_style: string;

    toggle_btn_wrapper_class_style: string;

    toggle_btn_icon_class_style: string;

    toggle_btn_content_wrapper_class_style: string;

    toggle_btn_class_style: string;

    panel_wrapper_class_style: string;

    filters_grid_class_style: string;

    actions_wrapper_class_style: string;

    clear_filters_btn_class_style?: ButtonUIClassStylesInterface;

    apply_filters_btn_class_style?: ButtonUIClassStylesInterface;

}


/* ---------------------------------- */
/* Action Props                       */
/* ---------------------------------- */

export interface FiltersPanelUIActionPropsInterface {

    on_apply_filters?: (
        filters: Record<string, any>
    ) => Promise<void>;

    on_clear_filters?: () => Promise<void>;

}


/* ---------------------------------- */
/* Props Interface                    */
/* ---------------------------------- */

export interface FiltersPanelUIPropsInterface {

    id?: string;

    toggle_btn_content?: string;

    filter_fields: FilterFieldConfigInterface[];

    apply_button?: ButtonUIPropsInterface;

    clear_button?: ButtonUIPropsInterface;

    action_props?: FiltersPanelUIActionPropsInterface;

    sync_route_query?: boolean;

    class_styles?: FiltersPanelUIClassStylesInterface;

    props_filter_values?: Record<string, any>

}


/* ---------------------------------- */
/* State                              */
/* ---------------------------------- */

export interface FiltersPanelUIStateDataInterface {

    is_open: boolean;

    filter_values: Record<string, any>;

}


/* ---------------------------------- */
/* Computed                           */
/* ---------------------------------- */

export interface FiltersPanelUIComputedDataInterface {

    has_filters: boolean;

}


/* ---------------------------------- */
/* Components                         */
/* ---------------------------------- */

export interface FiltersPanelUIComponentsInterface {

    InputGroupUI: Component;

    ButtonUI: Component;

}
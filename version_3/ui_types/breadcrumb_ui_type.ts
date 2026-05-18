import { Component } from "vue";
import { NavLinkUIClassStylesInterface, NavLinkUIPropsInterface } from "./nav_link_ui_type";

/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

export interface BreadcrumbUIClassStylesInterface {
    wrapper_class_style: string;

    list_class_style: string;

    item_wrapper_class_style: string;

    separator_class_style: string;

    nav_link_class_styles?: NavLinkUIClassStylesInterface;
}

/* ---------------------------------- */
/* Props Interface                    */
/* ---------------------------------- */

export interface BreadcrumbUIPropsInterface {
    id?: string;

    breadcrumb_items: NavLinkUIPropsInterface[];

    separator?: string;

    class_styles?: BreadcrumbUIClassStylesInterface;
}

/* ---------------------------------- */
/* State                              */
/* ---------------------------------- */

export interface BreadcrumbUIStateDataInterface {
    items_count: number;
}

/* ---------------------------------- */
/* Computed                           */
/* ---------------------------------- */

export interface BreadcrumbUIComputedDataInterface {
    has_items: boolean;

    display_items: NavLinkUIPropsInterface[];
}

/* ---------------------------------- */
/* Components                         */
/* ---------------------------------- */

export interface BreadcrumbUIComponentsInterface {
    NavLinkUI: Component;
}

import { Component } from "vue";
import { NavLinkUIPropsInterface } from "./nav_link_ui_type";

/* ---------------------------------- */
/* Position Types                     */
/* ---------------------------------- */

export type DropdownPosition =
    | "top"
    | "bottom"
    | "left"
    | "right";


/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

export interface DropdownMenuUIClassStylesInterface {

    wrapper_class_style: string;

    menu_class_style: string;

    menu_item_wrapper_class_style: string;

    visible_class_style: string;

}


/* ---------------------------------- */
/* Props Interface                    */
/* ---------------------------------- */

export interface DropdownMenuUIPropsInterface {

    id?: string;

    menu_items: NavLinkUIPropsInterface[];

    class_styles?: DropdownMenuUIClassStylesInterface;

}


/* ---------------------------------- */
/* State                              */
/* ---------------------------------- */

export interface DropdownMenuUIStateDataInterface {

    is_open: boolean;

    position: DropdownPosition;

    top: number;

    left: number;

}


/* ---------------------------------- */
/* Computed                           */
/* ---------------------------------- */

export interface DropdownMenuUIComputedDataInterface {

    wrapper_style: Record<string, string>;

}


/* ---------------------------------- */
/* Components                         */
/* ---------------------------------- */

export interface DropdownMenuUIComponentsInterface {

    NavLinkUI: Component;

}
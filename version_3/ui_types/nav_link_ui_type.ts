import { Component } from "vue";
import { SVGIconKey, SVGIconValue } from "../resources/svg_icon_resource";

/* ---------------------------------- */
/* Link Types                         */
/* ---------------------------------- */

export type NavLinkType = "router" | "external" | "action";

/* ---------------------------------- */
/* Action Return                      */
/* ---------------------------------- */

export interface NavLinkActionReturnInterface {
    status: boolean;
    msg: string;
    data?: Record<string, unknown>;
}

/* ---------------------------------- */
/* Action Props                       */
/* ---------------------------------- */

export interface NavLinkUIActionPropsInterface {
    on_click?: (
        event?: MouseEvent,
        config?: { props: NavLinkUIPropsInterface }
    ) => Promise<NavLinkActionReturnInterface | void>;
}

/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

export interface NavLinkUIClassStylesInterface {
    wrapper_class_style: string;

    active_menu_class_style: string;

    icon_img_wrapper_class_style: string;

    icon_img_class_style: string;

    content_class_style: string;

    children_caret_class_style?: string;
}

/* ---------------------------------- */
/* Props Interface                    */
/* ---------------------------------- */

export interface NavLinkUIPropsInterface {
    id?: string;

    link?: string;

    icon?: SVGIconKey | null;

    img_src?: string;

    img_alt_text?: string;

    content?: string;

    action_props?: NavLinkUIActionPropsInterface;

    class_styles?: NavLinkUIClassStylesInterface;

    has_permission?: boolean;

    children?: NavLinkUIPropsInterface[];

    children_caret_icon?: SVGIconKey | string;

    is_children_open?: boolean;

    on_children_toggle?: (event?: MouseEvent) => void;
}

/* ---------------------------------- */
/* State                              */
/* ---------------------------------- */

export interface NavLinkUIStateDataInterface {
    is_loading: boolean;
}

/* ---------------------------------- */
/* Computed                           */
/* ---------------------------------- */

export interface NavLinkUIComputedDataInterface {
    component_type: Component | "a" | "button";

    route_link: string | null;

    anchor_link: string | null;

    anchor_target: string | null;

    is_active_computed: boolean;

    icon_svg: SVGIconValue;
}

/* ---------------------------------- */
/* Components                         */
/* ---------------------------------- */

export interface NavLinkUIComponentsInterface {
    RouterLink: Component;
}

export interface NavLinkContentPayloadResultInterface {
    menu_id?: string;
    menu_text?: string;
    menu_icon?: SVGIconKey;
    menu_link?: string;
    menu_img_link?: string;
}

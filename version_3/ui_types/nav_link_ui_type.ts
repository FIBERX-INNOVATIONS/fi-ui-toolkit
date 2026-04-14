import { Component } from "vue";
import { SVGIconKey, SVGIconValue } from "../resources/svg_icon_resource";

/* ---------------------------------- */
/* Link Types                         */
/* ---------------------------------- */

export type NavLinkType =
    | "router"
    | "external"
    | "action";


/* ---------------------------------- */
/* Action Return                      */
/* ---------------------------------- */

export interface NavLinkActionReturnInterface {
    status: boolean;
    msg: string;
    data?: Record<string, any>;
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

    component_type: any;

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
    menu_text?: string,
    menu_icon?: SVGIconKey,
    menu_link?: string
}
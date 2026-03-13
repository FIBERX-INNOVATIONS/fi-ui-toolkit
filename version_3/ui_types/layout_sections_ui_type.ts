import { Component } from "vue";

/* ---------------------------------- */
/* Element Type                       */
/* ---------------------------------- */

export type LayoutSectionsElementType =
    | "nav"
    | "div"
    | "section"
    | "header"
    | "footer"
    | "aside"
    | "main";


/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

export interface LayoutSectionsUIClassStylesInterface {

    wrapper_class_style: string;

    section_1_wrapper_class_style: string;

    section_2_wrapper_class_style: string;

    section_3_wrapper_class_style: string;

}


/* ---------------------------------- */
/* Props Interface                    */
/* ---------------------------------- */

export interface LayoutSectionsUIPropsInterface {

    id?: string;

    element_type?: LayoutSectionsElementType;

    class_styles?: LayoutSectionsUIClassStylesInterface;

}


/* ---------------------------------- */
/* State                              */
/* ---------------------------------- */

export interface LayoutSectionsUIStateDataInterface {

    initialized: boolean;

}


/* ---------------------------------- */
/* Computed                           */
/* ---------------------------------- */

export interface LayoutSectionsUIComputedDataInterface {

    component_type: LayoutSectionsElementType;

}


/* ---------------------------------- */
/* Components                         */
/* ---------------------------------- */

export interface LayoutSectionsUIComponentsInterface {}

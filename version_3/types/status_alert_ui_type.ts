
import { SVGIconKey } from "../resources/svg_icon_resource";


/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

export interface StatusAlertUIClassStylesInterface {
    wrapper_class_style: string;
    alert_box_class_style: string;
    close_btn_class_style: string;
    status_icon_wrapper_class_style: string;
    status_icon_class_style: string;
    status_content_wrapper_class_style: string;
    status_content_class_style: string;
    sucess_bg_class_style: string;
    error_bg_class_style: string;
    info_bg_class_style: string;
    sucess_text_class_style: string;
    error_text_class_style: string;
    info_text_class_style: string;
}

/* ---------------------------------- */
/* Props Interface                    */
/* ---------------------------------- */

export interface StatusAlertUIPropsInterface {

    alert_box_id?: string;

    visible?: boolean;

    class_styles?: StatusAlertUIClassStylesInterface;

    close_btn_icon?: SVGIconKey;

    alert_status?: string | null;

    status_icon?: SVGIconKey | null;

    status_content_messgae?: string | null;

    on_close?: (event?: MouseEvent) => void | null;

}
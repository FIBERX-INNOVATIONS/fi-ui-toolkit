import { SVGIconKey } from "@ui_v3/resources/svg_icon_resource";
import { ActionMethodRetruninterface } from "./input_ui_type";

export type ToastStatusType = "success" | "error" | "warning" | "info";

export interface ToasterUIClassStylesInterface {

    wrapper_class_style: string;

    icon_wrapper_class_style: string;
    
    icon_class_style: string;

    message_class_style: string;

    border_class_style: (status?: ToastStatusType) => string;

    text_class_style: (status?: ToastStatusType) => string;
}

export interface ToasterUIPropsInterface {

    id?: string;

    message?: string;

    status?: ToastStatusType;

    status_icon?: SVGIconKey;

    duration?: number;

    class_styles?: ToasterUIClassStylesInterface;

    action_props?: ToasterUIActionPropsInterface;

}

export interface ToasterUIStateDataInterface {

    visible: boolean;

}

export interface ToasterUIComputedDataInterface {

    is_visible: boolean;

}

export interface ToasterUIComponentsInterface {}

export interface ToasterUIActionPropsInterface {

    on_click?: (
        event?: MouseEvent,
        input_config?: { props: ToasterUIPropsInterface }
    ) => Promise<ActionMethodRetruninterface>;

}
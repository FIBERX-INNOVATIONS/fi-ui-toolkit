
import { reactive } from "vue";

import { 
    ToasterUIPropsInterface,
    ToasterUIClassStylesInterface,
    ToasterUIActionPropsInterface,
    ToastStatusType
} from "../ui_types/toaster_ui_type";

import ToasterUIClassStyles from "../class_styles/toaster_ui_class_styles";
import { SVGIconKey } from "../resources/svg_icon_resource";


class ToasterUIPropsBuilder {

    public static toaster_id: string = "StatusAlertBox";
    
    public static class_styles?: ToasterUIClassStylesInterface;

    public static default_action_props?: ToasterUIActionPropsInterface;

    public static configure(
        toaster_id: string,
        class_styles: ToasterUIClassStylesInterface,
        action_props?: ToasterUIActionPropsInterface,
    ): void {

        ToasterUIPropsBuilder.toaster_id            = toaster_id ?? "ToasterBox";
        ToasterUIPropsBuilder.class_styles          = class_styles || ToasterUIClassStyles;
        ToasterUIPropsBuilder.default_action_props  = action_props || {};
    }

     /* ---------------------------------- */
    /* Build Props                        */
    /* ---------------------------------- */

    private static buildPropsObject(
        message?: string,
        status?: ToastStatusType,
        status_icon?: SVGIconKey,
        duration?: number,
        class_styles?: ToasterUIClassStylesInterface
    ): ToasterUIPropsInterface {

        return {
            id: ToasterUIPropsBuilder.toaster_id,
            message,
            status,
            status_icon,
            duration,
            class_styles: class_styles || ToasterUIPropsBuilder.class_styles,
            action_props: ToasterUIPropsBuilder.default_action_props
        };
    }

    /* ---------------------------------- */
    /* Public Builder                     */
    /* ---------------------------------- */
    public static getReactivePropsObject(
        message?: string,
        status?: ToastStatusType,
        status_icon?: SVGIconKey,
        duration?: number,
        class_styles?: ToasterUIClassStylesInterface
    ): ToasterUIPropsInterface {

        const props_obj = ToasterUIPropsBuilder.buildPropsObject(
            message,
            status,
            status_icon,
            duration,
            class_styles
        );

        return reactive<ToasterUIPropsInterface>(props_obj);
    }


}

export default ToasterUIPropsBuilder;
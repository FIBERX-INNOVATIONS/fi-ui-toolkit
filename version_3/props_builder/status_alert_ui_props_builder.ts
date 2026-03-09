import { reactive } from "vue";

import { SVGIconKey } from "../resources/svg_icon_resource";

import LoggerUtil from "../utils/logger_util";
import ContentManagerUtil from "../utils/content_manager_util";
import StatusAlertUIClassstyles from "../class_styles/status_alert_ui_class_styles";

import {
    StatusAlertUIClassStylesInterface,
    StatusAlertUIPropsInterface
} from "../ui_types/status_alert_ui_type";


class StatusAlertPropsBuilder {

    private static readonly name = "status_alert_ui_props_builder";

    private static readonly logger: LoggerUtil =
        new LoggerUtil({ prefix: StatusAlertPropsBuilder.name, show_timestamp: false });

    private static readonly content_manager: ContentManagerUtil =
        ContentManagerUtil.getInstance();

    /* ---------------------------------- */
    /* Global Config                      */
    /* ---------------------------------- */

    public static alert_box_id: string = "StatusAlertBox";

    public static class_styles?: StatusAlertUIClassStylesInterface;

    public static on_close: (event?: MouseEvent) => void | null;

    public static getStatusBgClassStyle: (alert_status: string | null) => string;

    public static getAnimationClassStyle: (visible: boolean) => string;

    public static getStatusTextClassStyle: (alert_status: string | null) => string;


    /* ---------------------------------- */
    /* Setup Method                       */
    /* ---------------------------------- */

    public static configure(
        alert_box_id: string,
        class_styles: StatusAlertUIClassStylesInterface,
        on_close: (event?: MouseEvent) => void | null,
        getStatusBgClassStyle: (alert_status: string | null) => string,
        getAnimationClassStyle: (visible: boolean) => string,
        getStatusTextClassStyle: (alert_status: string | null) => string,
    ): void {

        StatusAlertPropsBuilder.alert_box_id        = alert_box_id ?? "StatusAlertBox";
        StatusAlertPropsBuilder.class_styles        = class_styles || StatusAlertUIClassstyles;

        StatusAlertPropsBuilder.on_close                 = on_close
        StatusAlertPropsBuilder.getStatusBgClassStyle    = getStatusBgClassStyle
        StatusAlertPropsBuilder.getAnimationClassStyle   = getAnimationClassStyle
        StatusAlertPropsBuilder.getStatusTextClassStyle  = getStatusTextClassStyle
    }

    /* ---------------------------------- */
    /* Build Props                        */
    /* ---------------------------------- */

    private static buildPropsObject(
        alert_status: string | null,
        alert_message: string | null | undefined,
        status_icon: SVGIconKey | null,
    ): StatusAlertUIPropsInterface {

        const visible                   = !!(alert_status && alert_message);
        const default_class_style       = { alert_box_class_style: "", close_btn_class_style: "", status_icon_class_style: "", status_content_class_style: ""};
        const class_styles              = StatusAlertPropsBuilder.class_styles ?? default_class_style;

        class_styles.alert_box_class_style     = `${class_styles?.alert_box_class_style} ${StatusAlertPropsBuilder?.getStatusBgClassStyle?.(alert_status) ?? ""} ${StatusAlertPropsBuilder?.getAnimationClassStyle?.(visible) ?? ""}`;
        class_styles.close_btn_class_style     = `${class_styles?.close_btn_class_style} ${StatusAlertPropsBuilder?.getStatusBgClassStyle?.(alert_status) ?? ""} ${StatusAlertPropsBuilder?.getStatusTextClassStyle?.(alert_status) ?? ""}`;
        class_styles.status_icon_class_style   = `${class_styles?.status_icon_class_style} ${StatusAlertPropsBuilder?.getStatusTextClassStyle?.(alert_status) ?? ""}`;
        class_styles.status_content_class_style= `${class_styles?.status_content_class_style} ${StatusAlertPropsBuilder?.getStatusTextClassStyle?.(alert_status) ?? ""}`;

        return {
            alert_box_id: StatusAlertPropsBuilder.alert_box_id,
            visible,
            alert_status,
            status_icon,
            status_content_messgae: alert_message,
            on_close: StatusAlertPropsBuilder.on_close,
            class_styles: StatusAlertPropsBuilder.class_styles
        };
    }

    /* ---------------------------------- */
    /* Public Builder                     */
    /* ---------------------------------- */

    public static getReactivePropsObject(
        alert_status: string | null = null,
        alert_message: string | null | undefined = null,
        status_icon: SVGIconKey | null = null
    ): StatusAlertUIPropsInterface {

        const props_obj = StatusAlertPropsBuilder.buildPropsObject(
            alert_status,
            alert_message,
            status_icon
        );

        return reactive<StatusAlertUIPropsInterface>(props_obj);
    }

}

export default StatusAlertPropsBuilder;
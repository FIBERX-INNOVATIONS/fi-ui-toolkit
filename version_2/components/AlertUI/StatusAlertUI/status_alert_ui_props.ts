
import { ClassStyles }     from "./status_alert_ui_class_styles";
import SVGIcons            from "../../../resources/svg_icon_resource";



const StatusAlertUIProps   = {
    alert_box_id: { type: String, required: true },

    visible: { type: Boolean, default: false, required: false },

    wrapper_class_style: { type: String, default: ClassStyles?.wrapper_class_style, required: false },

    alert_box_class_style: { type: String, default: ClassStyles?.alert_box_class_style, required: false },

    close_btn_class_style: { type: String, default: ClassStyles?.close_btn_class_style, required: false },

    status_icon_wrapper_class_style: { type: String, default: ClassStyles?.status_icon_wrapper_class_style, required: false },

    status_icon_class_style: { type: String, default: ClassStyles?.status_icon_class_style, required: false },

    status_content_wrapper_class_style: { type: String, default: ClassStyles?.status_content_wrapper_class_style, required: false },

    status_content_class_style: { type: String, default: ClassStyles?.status_content_class_style, required: false },

    close_btn_icon: { type: String, default: SVGIcons?.x_circile_svg_icon, required: false },

    alert_status: { type: String, default: null, required: false }, 

    status_icon: { type: String, default: null, required: false },

    status_content_messgae: { type: String, default: "Hello!", required: false },

    on_close: { type: Function, default: () => {}, required: true },
}

export default StatusAlertUIProps;
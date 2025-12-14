
import { ClassStyles }     from "./toast_alert_ui_class_styles";

const ToastAlertUIProps   = {
    wrapper_class_style: { type: String, default: ClassStyles?.wrapper_class_style, required: false },
    
    icon_wrapper_class_style: { type: String, default: ClassStyles?.icon_wrapper_class_style, required: false },

    icon_class_style: { type: String, default: ClassStyles?.icon_class_style, required: false },

    message_class_style: { type: String, default: ClassStyles?.message_class_style, required: false },

    status_icon: { type: String, default: "", required: false }, 

    status: { type: String, default: "", required: true }, 

    message: { type: String, default: "", required: true }, 

    on_close: { type: Function, default: () => {}, required: true },
}

export default ToastAlertUIProps;
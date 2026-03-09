
import { PropType } from "vue";

import StatusAlertUIClassstyles from "../class_styles/status_alert_ui_class_style";

import { SVGIconKey } from "../resources/svg_icon_resource";

import {
    StatusAlertUIPropsInterface,
    StatusAlertUIClassStylesInterface
} from "../types/status_alert_ui_type";

const StatusAlertUIProps = {

    alert_box_id: {
        type: String,
        require: true
    },

    visible: {
        type: Boolean,
        default: false
    },

    class_styles: {
        type: Object as PropType<StatusAlertUIClassStylesInterface>,
        default: () => StatusAlertUIClassstyles
    },

    close_btn_icon: {
        type: String as PropType<SVGIconKey>,
        default: "x_circile_svg_icon"
    },

    alert_status: {
        type: String,
        default: null
    },

    status_icon: {
        type: String as PropType<SVGIconKey | null>,
        default: null
    },

    status_content_messgae: {
        type: String,
        default: "Hello!"
    },

    on_close: {
        type: Function as PropType<() => void>,
        required: true,
        default: () => {}
    }

} satisfies Record<keyof StatusAlertUIPropsInterface, any>;

export default StatusAlertUIProps;
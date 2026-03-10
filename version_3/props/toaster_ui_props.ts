
import { PropType } from "vue";

import { 
    ToastStatusType,
    ToasterUIActionPropsInterface,
    ToasterUIClassStylesInterface, 
    ToasterUIPropsInterface 
} from "../ui_types/toaster_ui_type";

import ToasterUIClassStyles from "../class_styles/toaster_ui_class_styles";
import { SVGIconKey } from "@ui_v3/resources/svg_icon_resource";


const ToasterUIProps = {

    id: {
        type: String,
        default: undefined
    },

    message: {
        type: String,
        default: ""
    },

    status: {
        type: String as PropType<ToastStatusType>,
        default: "info"
    },

    status_icon: {
        type: String as PropType<SVGIconKey>,
        default: "check_circle_svg_icon"
    },

    duration: {
        type: Number,
        default: 0
    },

    class_styles: {
        type: Object as PropType<ToasterUIClassStylesInterface>,
        default: () => ToasterUIClassStyles
    },

    action_props: {
        type: Object as PropType<ToasterUIActionPropsInterface>,
        default: () => ({})
    }

} satisfies Record<keyof ToasterUIPropsInterface, any>;

export default ToasterUIProps;
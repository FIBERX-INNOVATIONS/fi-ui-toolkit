import { PropType } from "vue";

import ButtonUIClassStyles from "../class_styles/button_ui_class_styles";

import {
    ButtonType,
    ButtonUIClassStylesInterface,
    ButtonUIContentOptionsInterface,
    ButtonUIBooleanPropsInterface,
    ButtonUIActionPropsInterface,
    ButtonUIPropsInterface
} from "../ui_types/button_ui_type";


const ButtonUIProps = {

    id: {
        type: String,
        required: true
    },

    type: {
        type: String as PropType<ButtonType>,
        default: "button"
    },

    content_props: {
        type: Object as PropType<ButtonUIContentOptionsInterface>,
        default: () => ({})
    },

    boolean_props: {
        type: Object as PropType<ButtonUIBooleanPropsInterface>,
        default: () => ({})
    },

    action_props: {
        type: Object as PropType<ButtonUIActionPropsInterface>,
        default: () => ({})
    },

    class_styles: {
        type: Object as PropType<ButtonUIClassStylesInterface>,
        default: () => ButtonUIClassStyles
    }

} satisfies Record<keyof ButtonUIPropsInterface, any>;

export default ButtonUIProps;
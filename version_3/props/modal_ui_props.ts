import { PropType } from "vue";

import ModalUIClassStyles from "../class_styles/modal_ui_class_styles";

import {
    ModalUIClassStylesInterface,
    ModalAnimationType,
    ModalUIActionPropsInterface,
    ModalUIPropsInterface,
    ModalUIContentPropsInterface,
} from "../ui_types/modal_ui_type";

import { SVGIconKey } from "../resources/svg_icon_resource";
import { OverlayUIPropsInterface } from "../ui_types/overlay_ui_type";


const ModalUIProps = {

    overlay_props: {
        type: Object as PropType<OverlayUIPropsInterface>,
        default: () => ({})
    },

    title_text: {
        type: String,
        default: ""
    },

    title_icon: {
        type: String as PropType<SVGIconKey | null>,
        default: null
    },

    title_img: {
        type: String,
        default: ""
    },

    animation_type: {
        type: String as PropType<ModalAnimationType>,
        default: "fade"
    },

    layer: {
        type: Number,
        default: 1
    },

    content_props: {
        type: Object as PropType<ModalUIContentPropsInterface>,
        default: () => ({})
    },

    action_props: {
        type: Object as PropType<ModalUIActionPropsInterface>,
        default: () => ({})
    },

    class_styles: {
        type: Object as PropType<ModalUIClassStylesInterface>,
        default: () => ModalUIClassStyles
    }

} satisfies Record<keyof ModalUIPropsInterface, any>;

export default ModalUIProps;
import { PropType } from "vue";

import ModalUIClassStyles from "../class_styles/modal_ui_class_styles";

import {
    ModalUIClassStylesInterface,
    ModalAnimationType,
    ModalUIActionPropsInterface,
    ModalUIPropsInterface,
    ModalUIContentPropsInterface,
    ModalUIComponentsPropsInterface,
    ModalUIGetComponentsPropsInterface
} from "../ui_types/modal_ui_type";

import { SVGIconKey } from "../resources/svg_icon_resource";


const ModalUIProps = {

    id: {
        type: String,
        required: true
    },

    overlay_id: {
        type: String,
        required: true
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
    },

    components: {
        type: Object as PropType<ModalUIComponentsPropsInterface>,
        default: () => ({})
    },

    get_component_props: {
        type: Object as PropType<ModalUIGetComponentsPropsInterface>,
        default: () => ({})
    },

} satisfies Record<keyof ModalUIPropsInterface, any>;

export default ModalUIProps;
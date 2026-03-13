import { PropType } from "vue";

import ImageRenderUIClassStyles from "../class_styles/image_render_ui_class_styles";

import {
    ImageRenderUIClassStylesInterface,
    ImageRenderUIBooleanPropsInterface,
    ImageRenderUIActionPropsInterface,
    ImageRenderUIPropsInterface
} from "../ui_types/image_render_ui_type";


const ImageRenderUIProps = {

    id: {
        type: String,
        required: true
    },

    src: {
        type: String,
        required: true
    },

    alt_text: {
        type: String,
        default: ""
    },

    content: {
        type: String,
        default: ""
    },

    boolean_props: {
        type: Object as PropType<ImageRenderUIBooleanPropsInterface>,
        default: () => ({})
    },

    action_props: {
        type: Object as PropType<ImageRenderUIActionPropsInterface>,
        default: () => ({})
    },

    class_styles: {
        type: Object as PropType<ImageRenderUIClassStylesInterface>,
        default: () => ImageRenderUIClassStyles
    }

} satisfies Record<keyof ImageRenderUIPropsInterface, any>;

export default ImageRenderUIProps;
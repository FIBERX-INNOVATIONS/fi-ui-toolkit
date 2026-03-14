import { PropType } from "vue";

import OverlayUIClassStyles from "../class_styles/overlay_ui_class_styles";

import {
    OverlayUIBooleanPropsInterface,
    OverlayUIActionPropsInterface,
    OverlayUIClassStylesInterface
} from "../ui_types/overlay_ui_type";


const OverlayUIProps = {

    id: {
        type: String,
        required: true
    },

    model_value: {
        type: Boolean,
        default: false
    },

    boolean_props: {
        type: Object as PropType<OverlayUIBooleanPropsInterface>,
        default: () => ({})
    },

    action_props: {
        type: Object as PropType<OverlayUIActionPropsInterface>,
        default: () => ({})
    },

    class_styles: {
        type: Object as PropType<OverlayUIClassStylesInterface>,
        default: () => OverlayUIClassStyles
    }

};

export default OverlayUIProps;
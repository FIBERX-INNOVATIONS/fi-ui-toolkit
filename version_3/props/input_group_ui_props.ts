import { PropType } from "vue";

import InputGroupUIClassStyles from "../class_styles/input_group_ui_class_styles";

import {
    InputGroupUIPropsInterface,
    InputGroupUIClassStylesInterface
} from "../ui_types/input_group_ui_type";

import { InputUIPropsInterface } from "../ui_types/input_ui_type";


const InputGroupUIProps = {

    id: {
        type: String,
        required: false
    },

    label_text: {
        type: String,
        default: ""
    },

    show_required_text: {
        type: Boolean,
        default: false
    },

    required_text: {
        type: String,
        default: "*"
    },

    input_props: {
        type: Object as PropType<InputUIPropsInterface>,
        required: true
    },

    class_styles: {
        type: Object as PropType<InputGroupUIClassStylesInterface>,
        default: () => InputGroupUIClassStyles
    }

};

export default InputGroupUIProps;
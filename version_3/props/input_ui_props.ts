import { PropType } from "vue";

import InputUIClassStyles from "../class_styles/input_ui_class_styles"
import {
    InputType,
    InputUIClassStylesInterface,
    InputUIContentOptionsInterface,
    InputUIBooleanPropsInterface,
    SelectOptionInterface,
    InputUINumberPropsInterface,
    InputUIActionPropsInterface,
    InputUIFilePropsInterface,
    InputUIPropsInterface
} from "../ui_types/input_ui_type";


const InputUIProps = {

    id: { 
        type: String, 
        required: true,
    },

    switch_btn_id: { 
        type: String, 
        require: false 
    },

    type: { 
        type: String as PropType<InputType>,
        default: "text"
    },

    model_value: {
        type: [String, Number, Boolean, Array, Object] as PropType<string | number | boolean | Array<any> | File | null>,
        default: null,
        require: false
    },

    placeholder_text: { 
        type: String, 
        default: "", 
        require: false 
    },

    content_props: {
        type: Object as PropType<InputUIContentOptionsInterface>,
        default: () => ({})
    },

    boolean_props: {
        type: Object as PropType<InputUIBooleanPropsInterface>,
        default: () => ({})
    },

    option_props: {
        type: Array as PropType<Array<SelectOptionInterface>>,
        default: () => []
    },

    number_props: {
        type: Object as PropType<InputUINumberPropsInterface>,
        default: () => ({}) 
    },

    file_props: {
        type: Object as PropType<InputUIFilePropsInterface>,
        default: () => ({}) 
    },

    action_props: {
        type: Object as PropType<InputUIActionPropsInterface>,
        default: () => ({}) 
    },

    helper_text: { 
        type: String, 
        require: false,
        default: ""
    },

    class_styles: {
        type: Object as PropType<InputUIClassStylesInterface>,
        default: () => (InputUIClassStyles)
    }

} satisfies Record<keyof InputUIPropsInterface, any>;

export default InputUIProps;
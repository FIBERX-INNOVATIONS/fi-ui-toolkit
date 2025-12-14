
import { PropType }                 from "vue";
import { ClassStyles }              from "./input_group_ui_class_styles";
import { InputUIPropsInterface }     from "../../types/props_builder_type";

const InputGroupUIProps   = {
    wrapper_class_style: { type: String, default: ClassStyles?.wrapper_class_style, required: false },
    
    label_class_style: { type: String, default: ClassStyles?.label_class_style, required: false },

    label_required_class_style: { type: String, default: ClassStyles?.label_required_class_style, required: false },

    label_text: { type: String, default: "", required: false }, 

    label_required_text: { type: String, default: "", required: false }, 

    input_config: { type: Object as PropType<InputUIPropsInterface>, required: true },

}

export default InputGroupUIProps;
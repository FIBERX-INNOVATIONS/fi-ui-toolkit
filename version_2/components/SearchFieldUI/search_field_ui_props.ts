
import { PropType }                 from "vue";
import { ClassStyles }              from "./search_field_ui_class_styles";

import { 
    InputUIPropsInterface,
    ButtonUIPropsInterface
} from "../../types/props_builder_type";

const SearchFieldUIProps   = {
    wrapper_class_style: { type: String, default: ClassStyles?.wrapper_class_style, required: false },
    
    label_class_style: { type: String, default: ClassStyles?.label_class_style, required: false },

    label_required_class_style: { type: String, default: ClassStyles?.label_required_class_style, required: false },

    search_wrapper_class_style: { type: String, default: ClassStyles?.search_wrapper_class_style, required: false },

    btn_wrapper_class_style: { type: String, default: ClassStyles?.btn_wrapper_class_style, required: false },

    input_wrapper_class_style: { type: String, default: ClassStyles?.input_wrapper_class_style, required: false },
    
    label_text: { type: String, default: "", required: false }, 

    label_required_text: { type: String, default: "", required: false }, 

    input_config: { type: Object as PropType<InputUIPropsInterface>, required: true },

    btn_config: { type: Object as PropType<ButtonUIPropsInterface>, required: true },

}

export default SearchFieldUIProps;
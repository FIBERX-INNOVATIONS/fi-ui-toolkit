
import { ClassStyles }     from "./top_bar_ui_class_styles";


const TopBarUIProps   = {
    wrapper_class_style: { type: String, default: ClassStyles?.wrapper_class_style, required: false },

    section_1_wrapper_class_style: { type: String, default: ClassStyles?.section_1_wrapper_class_style, required: false },

    section_2_wrapper_class_style: { type: String, default: ClassStyles?.section_2_wrapper_class_style, required: false },

    section_3_wrapper_class_style: { type: String, default: ClassStyles?.section_3_wrapper_class_style, required: false },

}

export default TopBarUIProps;
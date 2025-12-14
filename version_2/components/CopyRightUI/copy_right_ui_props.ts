
import { ClassStyles }     from "./copy_right_ui_class_styles";

const current_year          = new Date().getFullYear().toString();

const CopyRightUIProps   = {
    wrapper_class_style: { type: String, default: ClassStyles?.wrapper_class_style, required: false },

    text_class_style: { type: String, default: ClassStyles?.text_class_style, required: false },

    year: { type: String, default: current_year, required: false },

    powered_by_text: { type: String, required: true },

    author_text: { type: String, required: true },
}

export default CopyRightUIProps;
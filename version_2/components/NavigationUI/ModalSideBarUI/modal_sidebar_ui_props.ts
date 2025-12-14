
import { ClassStyles }     from "./modal_sidebar_ui_class_styles";

const ModalSidebarUIProps   = {
    id: { type: String, required: true },

    visible: { type: Boolean, default: false, required: true },

    wrapper_class_style: { type: String, default: ClassStyles?.wrapper_class_style, required: false },

    sidebar_class_style: { type: String, default: ClassStyles?.sidebar_class_style, required: false },

    section_1_wrapper_class_style: { type: String, default: ClassStyles?.section_1_wrapper_class_style, required: false },

    section_2_wrapper_class_style: { type: String, default: ClassStyles?.section_2_wrapper_class_style, required: false },

    on_click: { type: Function, default: null, required: false },
}

export default ModalSidebarUIProps;
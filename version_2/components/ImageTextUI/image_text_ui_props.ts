import type { PropType }            from "vue";
import { ClassStyles }              from "./image_text_ui_class_styles";

const ImageTextUIProps   = {
    wrapper_class_style: { type: String, default: ClassStyles?.wrapper_class_style, required: false },

    img_wrapper_class_style: { type: String, default: ClassStyles?.img_wrapper_class_style, required: false },

    img_class_style: { type: String, default: ClassStyles?.img_class_style, required: false },

    text_class_style: { type: String, default: ClassStyles?.text_class_style, required: false },

    image_src: { type: String, required: false, default: null },

    img_alt_text: { type: String, required: false, default: null },

    text_content: { type: String, required: false, default: null },
}

export default ImageTextUIProps;
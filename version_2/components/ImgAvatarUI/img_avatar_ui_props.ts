
import { ClassStyles }     from "./img_avatar_ui_class_styles";

const ImgAvatarUIProps   = {

    id: { type: String, required: true },

    img_src: { type: String, default: null, required: false },

    img_alt_text: { type: String, default: null, required: false },

    initials:{ type: String, default: null, required: false },

    right_slot_content:{ type: String, default: null, required: false },
    
    wrapper_class_style: { type: String, default: ClassStyles?.wrapper_class_style, required: false },

    avatar_circle_class_style: { type: String, default: ClassStyles?.avatar_circle_class_style, required: false },

    img_class_style: { type: String, default: ClassStyles?.img_class_style, required: false },

    initials_class_style: { type: String, default: ClassStyles?.initials_class_style, required: false },

    right_slot_class_style: { type: String, default: ClassStyles?.right_slot_class_style, required: false },

    on_click: { type: Function, default: null, required: false },

}

export default ImgAvatarUIProps;
import { PropType }                 from "vue";
import { ClassStyles }              from "./nav_link_ui_class_styles";
import { NavLinkUIPropsInterface } from "../../../types/props_builder_type";

const NavLinkUIProps   = {
    wrapper_class_style: { type: String, default: ClassStyles?.wrapper_class_style, required: false },

    active_menu_class_style: { type: String, default: ClassStyles?.active_menu_class_style, required: false },

    icon_img_wrapper_class_style: { type: String, default: ClassStyles?.icon_img_wrapper_class_style, required: false },

    icon_img_class_style: { type: String, default: ClassStyles?.icon_img_class_style, required: false },

    content_class_style: { type: String, default: ClassStyles?.content_class_style, required: false },

    content:{ type: String, default: null, required: false },

    id: { type: String, required: true },
    
    link: { type: String, default: null, required: false },

    icon: { type: String, default: null, required: false },

    img_src: { type: String, default: null, required: false },

    img_alt_text: { type: String, default: null, required: false },

    on_click: { type: Function, default: null, required: false },

    is_active: { type: Function, default: () => { return false }, required: false },

    sub_menu_list: { type: Array as PropType<NavLinkUIPropsInterface[]>,  default: () => { return [] }, required: false },

}

export default NavLinkUIProps;
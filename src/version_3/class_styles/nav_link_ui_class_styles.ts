import { NavLinkUIClassStylesInterface } from "../ui_types/nav_link_ui_type";

const NavLinkUIClassStyles: NavLinkUIClassStylesInterface = {
    wrapper_class_style: "flex items-center gap-2 cursor-pointer",

    active_menu_class_style: "text-blue-600 font-semibold",

    icon_img_wrapper_class_style: "flex items-center",

    icon_img_class_style: "w-5 h-5",

    content_class_style: "text-sm",

    children_caret_class_style:
        "inline-flex items-center justify-center w-5 h-5 text-gray-500 hover:text-gray-700 transition-transform duration-200"
};

export default NavLinkUIClassStyles;

import type { PropType }            from "vue"
import { ClassStyles }              from "./bread_crumb_ui_class_styles";
import { NavLinkUIPropsInterface }  from "../../../types/props_builder_type";

const BreadCrumbUIProps   = {
    wrapper_class_style: { type: String, default: ClassStyles?.wrapper_class_style, required: false },

    list_class_style: { type: String, default: ClassStyles?.list_class_style, required: false },

    list_item_class_style: { type: String, default: ClassStyles?.list_item_class_style, required: false },

    divider_class_style: { type: String, default: ClassStyles?.divider_class_style, required: false },

    divider_content: { type: String, default: "\\" },

    menu_list: { type: Array as PropType<NavLinkUIPropsInterface[]>,  default: () => [], required: true}
}

export default BreadCrumbUIProps;
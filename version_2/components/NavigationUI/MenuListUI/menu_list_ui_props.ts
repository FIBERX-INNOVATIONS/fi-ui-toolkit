import type { PropType }            from "vue"
import { ClassStyles }              from "./menu_list_ui_class_styles";
import { NavLinkUIPropsInterface }  from "../../../types/props_builder_type";



const MenuListUIProps   = {
    id: { type: String, required: true },

    parent_id: { type: String, default: null, required: false },

    wrapper_class_style: { type: String, default: ClassStyles?.wrapper_class_style, required: false },

    list_class_style: { type: String, default: ClassStyles?.list_class_style, required: false },

    list_item_class_style: { type: String, default: ClassStyles?.list_item_class_style, required: false },

    menu_list: { type: Array as PropType<NavLinkUIPropsInterface[]>,  default: () => [], required: true}
}

export default MenuListUIProps;
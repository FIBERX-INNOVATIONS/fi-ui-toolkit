import { PropType } from "vue";

import DropdownMenuUIClassStyles from "../class_styles/dropdown_menu_ui_class_styles";

import {
    DropdownMenuUIClassStylesInterface,
    DropdownMenuUIPropsInterface
} from "../ui_types/dropdown_menu_ui_type";

import { NavLinkUIPropsInterface } from "../ui_types/nav_link_ui_type";


const DropdownMenuUIProps = {

    id: {
        type: String,
        required: true
    },

    menu_items: {
        type: Array as PropType<NavLinkUIPropsInterface[]>,
        default: () => []
    },

    class_styles: {
        type: Object as PropType<DropdownMenuUIClassStylesInterface>,
        default: () => DropdownMenuUIClassStyles
    }

} satisfies Record<keyof DropdownMenuUIPropsInterface, any>;

export default DropdownMenuUIProps;
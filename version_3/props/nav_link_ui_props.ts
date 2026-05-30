import { PropType } from "vue";

import NavLinkUIClassStyles from "../class_styles/nav_link_ui_class_styles";

import {
    NavLinkUIClassStylesInterface,
    NavLinkUIActionPropsInterface,
    NavLinkUIPropsInterface
} from "../ui_types/nav_link_ui_type";

import { SVGIconKey } from "../resources/svg_icon_resource";

const NavLinkUIProps = {
    id: {
        type: String,
        required: false
    },

    link: {
        type: String,
        required: false
    },

    icon: {
        type: String as PropType<SVGIconKey | null>,
        default: null
    },

    img_src: {
        type: String,
        default: ""
    },

    img_alt_text: {
        type: String,
        default: ""
    },

    content: {
        type: String,
        default: ""
    },

    action_props: {
        type: Object as PropType<NavLinkUIActionPropsInterface>,
        default: () => ({})
    },

    has_permission: {
        type: Boolean,
        default: true
    },

    children: {
        type: Array as PropType<NavLinkUIPropsInterface[]>,
        default: () => []
    },

    children_caret_icon: {
        type: String as PropType<SVGIconKey | string>,
        default: ""
    },

    is_children_open: {
        type: Boolean,
        default: false
    },

    on_children_toggle: {
        type: Function as PropType<(event?: MouseEvent) => void>,
        default: undefined
    },

    class_styles: {
        type: Object as PropType<NavLinkUIClassStylesInterface>,
        default: () => NavLinkUIClassStyles
    }
} satisfies Record<keyof NavLinkUIPropsInterface, any>;

export default NavLinkUIProps;

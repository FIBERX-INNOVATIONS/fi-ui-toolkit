import { PropType } from "vue";

import BreadcrumbUIClassStyles from "../class_styles/breadcrumb_ui_class_styles";

import {
    BreadcrumbUIClassStylesInterface,
    BreadcrumbUIPropsInterface
} from "../ui_types/breadcrumb_ui_type";

import { NavLinkUIPropsInterface } from "../ui_types/nav_link_ui_type";


const BreadcrumbUIProps = {

    id: {
        type: String,
        required: true
    },

    breadcrumb_items: {
        type: Array as PropType<NavLinkUIPropsInterface[]>,
        default: () => []
    },

    separator: {
        type: String,
        default: "/"
    },

    class_styles: {
        type: Object as PropType<BreadcrumbUIClassStylesInterface>,
        default: () => BreadcrumbUIClassStyles
    }

} satisfies Record<keyof BreadcrumbUIPropsInterface, any>;

export default BreadcrumbUIProps;
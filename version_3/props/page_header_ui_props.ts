import { PropType } from "vue";

import PageHeaderUIClassStyles from "../class_styles/page_header_ui_class_styles";

import {
    PageHeaderUIClassStylesInterface
} from "../ui_types/page_header_ui_type";

import { HeaderTextUIPropsInterface } from "../ui_types/header_text_ui_type";
import { ButtonUIPropsInterface } from "../ui_types/button_ui_type";


const PageHeaderUIProps = {

    id: {
        type: String,
        default: ""
    },

    header_props: {
        type: Object as PropType<HeaderTextUIPropsInterface>,
        default: () => ({})
    },

    description_text: {
        type: String,
        default: ""
    },

    action_buttons: {
        type: Array as PropType<ButtonUIPropsInterface[]>,
        default: () => []
    },

    class_styles: {
        type: Object as PropType<PageHeaderUIClassStylesInterface>,
        default: () => PageHeaderUIClassStyles
    }

};

export default PageHeaderUIProps;
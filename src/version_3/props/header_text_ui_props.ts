import { PropType } from "vue";

import {
    HeaderTagType,
    HeaderTextUIClassStylesInterface,
    HeaderTextUIPropsInterface
} from "../ui_types/header_text_ui_type";

import HeaderTextUiClassStyles from "../class_styles/header_text_class_styles";

const HeaderTextUIProps = {
    header_tag: {
        type: String as PropType<HeaderTagType>,
        default: "h2"
    },

    text_value: {
        type: String,
        default: ""
    },

    class_styles: {
        type: Object as PropType<HeaderTextUIClassStylesInterface>,
        default: () => HeaderTextUiClassStyles
    }
} satisfies Record<keyof HeaderTextUIPropsInterface, any>;

export default HeaderTextUIProps;

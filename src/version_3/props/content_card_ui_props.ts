import { PropType } from "vue";

import ContentCardUIClassStyles from "../class_styles/content_card_ui_class_styles";

import {
    ContentCardUIActionPropsInterface,
    ContentCardUIBooleanPropsInterface,
    ContentCardUIClassStylesInterface,
    ContentCardUIContentPropsInterface,
    ContentCardUIDataPropsInterface,
    ContentCardUIPropsInterface
} from "../ui_types/content_card_ui_type";

const ContentCardUIProps = {
    id: {
        type: String,
        required: true
    },

    content_props: {
        type: Object as PropType<ContentCardUIContentPropsInterface>,
        default: () => ({})
    },

    data_props: {
        type: Object as PropType<ContentCardUIDataPropsInterface>,
        default: () => ({})
    },

    boolean_props: {
        type: Object as PropType<ContentCardUIBooleanPropsInterface>,
        default: () => ({})
    },

    action_props: {
        type: Object as PropType<ContentCardUIActionPropsInterface>,
        default: () => ({})
    },

    class_styles: {
        type: Object as PropType<ContentCardUIClassStylesInterface>,
        default: () => ContentCardUIClassStyles
    }
} satisfies Record<keyof ContentCardUIPropsInterface, any>;

export default ContentCardUIProps;

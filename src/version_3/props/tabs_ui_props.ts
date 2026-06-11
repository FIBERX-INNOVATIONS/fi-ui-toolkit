import { PropType } from "vue";

import TabsUIClassStyles from "../class_styles/tabs_ui_class_styles";

import {
    TabsUIActionPropsInterface,
    TabsUIBooleanPropsInterface,
    TabsUIClassStylesInterface,
    TabsUIContentPropsInterface,
    TabsUIDataPropsInterface,
    TabsUIPropsInterface
} from "../ui_types/tabs_ui_type";

const TabsUIProps = {
    id: {
        type: String,
        required: true
    },

    content_props: {
        type: Object as PropType<TabsUIContentPropsInterface>,
        default: () => ({})
    },

    data_props: {
        type: Object as PropType<TabsUIDataPropsInterface>,
        default: () => ({})
    },

    boolean_props: {
        type: Object as PropType<TabsUIBooleanPropsInterface>,
        default: () => ({})
    },

    action_props: {
        type: Object as PropType<TabsUIActionPropsInterface>,
        default: () => ({})
    },

    class_styles: {
        type: Object as PropType<TabsUIClassStylesInterface>,
        default: () => TabsUIClassStyles
    }
} satisfies Record<keyof TabsUIPropsInterface, any>;

export default TabsUIProps;

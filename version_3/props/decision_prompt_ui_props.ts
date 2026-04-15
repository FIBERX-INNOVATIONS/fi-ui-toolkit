import { PropType } from "vue";

import DecisionPromptUIClassStyles from "../class_styles/decision_prompt_ui_class_styles";

import {
    DecisionPromptUIPropsInterface,
    DecisionPromptUIClassStylesInterface,
    DecisionPromptUIContentPropsInterface,
} from "../ui_types/decision_prompt_ui_type";

import { ButtonUIPropsInterface } from "../ui_types/button_ui_type";

const DecisionPromptUIProps = {

    content_props: {
        type: Object as PropType<DecisionPromptUIContentPropsInterface>,
        default: () => ({})
    },

    confirm_button_props: {
        type: Object as PropType<ButtonUIPropsInterface>,
        default: () => ({})
    },

    cancel_button_props: {
        type: Object as PropType<ButtonUIPropsInterface>,
        default: () => ({})
    },

    class_styles: {
        type: Object as PropType<DecisionPromptUIClassStylesInterface>,
        default: () => DecisionPromptUIClassStyles
    }

} satisfies Record<keyof DecisionPromptUIPropsInterface, any>;

export default DecisionPromptUIProps;
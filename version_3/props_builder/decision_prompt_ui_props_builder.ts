import { reactive } from "vue";

import DecisionPromptUIClassStyles from "../class_styles/decision_prompt_ui_class_styles";

import {
    DecisionPromptUIClassStylesInterface,
    DecisionPromptUIPropsInterface
} from "../ui_types/decision_prompt_ui_type";

import ContentManagerUtil from "../utils/content_manager_util";
import { ButtonUIPropsInterface } from "../ui_types/button_ui_type";

class DecisionPromptUIPropsBuilder {

    public static getReactivePropsObject(
        overrides: Partial<DecisionPromptUIPropsInterface> = {}
    ): DecisionPromptUIPropsInterface {

        return reactive({

            content_props: {
                title_text: "",
                message_text: "",
                ...overrides.content_props
            },

            confirm_button_props: {
                content_props: {
                    button_html_content: "Confirm"
                },
                ...overrides.confirm_button_props
            },

            cancel_button_props: {
                content_props: {
                    button_html_content: "Cancel"
                },
                ...overrides.cancel_button_props
            },

            class_styles: {
                ...DecisionPromptUIClassStyles,
                ...overrides.class_styles
            }

        });
    }

    /**
     * 🔹 Build props using content keys
     */
    public static buildFromContentKeys({
        title_text_content_key,
        message_text_content_key,
        record,
        confirm_button_props,
        cancel_button_props,
        class_styles
    }: {
        title_text_content_key?: string;
        message_text_content_key?: string;
        record?: Record<string, any>
        confirm_button_props?: Partial<ButtonUIPropsInterface>;
        cancel_button_props?: Partial<ButtonUIPropsInterface>;
        class_styles?: DecisionPromptUIClassStylesInterface;
    }): DecisionPromptUIPropsInterface {

        const content_manager = ContentManagerUtil.getInstance();

        const title_text =
            content_manager?.getWithRecord<string>(title_text_content_key ?? "", record, "" ) ?? "";

        const message_text =
            content_manager?.getWithRecord<string>(message_text_content_key ?? "", record, "") ?? "";

        return this.getReactivePropsObject({
            content_props: {
                title_text,
                message_text
            },

            confirm_button_props,
            cancel_button_props,
            class_styles
        });
    }
}

export default DecisionPromptUIPropsBuilder;
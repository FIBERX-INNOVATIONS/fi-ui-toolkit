import { reactive } from "vue";

import BasePropSchema from "../base_classes/base_prop_schema";
import DecisionPromptUIClassStyles from "../class_styles/decision_prompt_ui_class_styles";

import {
    DecisionPromptUIBooleanPropsInterface,
    DecisionPromptUIClassStylesInterface,
    DecisionPromptUIPropsInterface
} from "../ui_types/decision_prompt_ui_type";

import ContentManagerUtil from "../utils/content_manager_util";
import { ButtonUIPropsInterface } from "../ui_types/button_ui_type";

class DecisionPromptUIPropsBuilder extends BasePropSchema<DecisionPromptUIPropsInterface> {
    public static readonly static_prop_keys = [
        "action_props",
        "class_styles"
    ] satisfies readonly (keyof DecisionPromptUIPropsInterface)[];

    public static getReactivePropsObject(
        overrides: Partial<DecisionPromptUIPropsInterface> = {}
    ): DecisionPromptUIPropsInterface {
        return this.createReactiveProps<DecisionPromptUIPropsInterface>({
            content_props: {
                title_text: "",
                message_text: "",
                reason_label_text: "",
                reason_placeholder_text: "",
                reason_helper_text: "",
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

            boolean_props: {
                show_reason_input: false,
                reason_required: false,
                ...overrides.boolean_props
            },

            action_props: {
                ...overrides.action_props
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
        reason_label_text_content_key,
        reason_placeholder_text_content_key,
        reason_helper_text_content_key,
        record,
        confirm_button_props,
        cancel_button_props,
        boolean_props,
        class_styles
    }: {
        title_text_content_key?: string;
        message_text_content_key?: string;
        reason_label_text_content_key?: string;
        reason_placeholder_text_content_key?: string;
        reason_helper_text_content_key?: string;
        record?: Record<string, any>;
        confirm_button_props?: Partial<ButtonUIPropsInterface>;
        cancel_button_props?: Partial<ButtonUIPropsInterface>;
        boolean_props?: DecisionPromptUIBooleanPropsInterface;
        class_styles?: DecisionPromptUIClassStylesInterface;
    }): DecisionPromptUIPropsInterface {
        const content_manager = ContentManagerUtil.getInstance();

        const title_text = content_manager?.getWithRecord<string>(title_text_content_key ?? "", record, "") ?? "";

        const message_text = content_manager?.getWithRecord<string>(message_text_content_key ?? "", record, "") ?? "";

        const reason_label_text = reason_label_text_content_key
            ? (content_manager?.getWithRecord<string>(reason_label_text_content_key, record, "") ?? "")
            : "";

        const reason_placeholder_text = reason_placeholder_text_content_key
            ? (content_manager?.getWithRecord<string>(reason_placeholder_text_content_key, record, "") ?? "")
            : "";

        const reason_helper_text = reason_helper_text_content_key
            ? (content_manager?.getWithRecord<string>(reason_helper_text_content_key, record, "") ?? "")
            : "";

        return this.getReactivePropsObject({
            content_props: {
                title_text,
                message_text,
                reason_label_text,
                reason_placeholder_text,
                reason_helper_text
            },

            confirm_button_props,
            cancel_button_props,
            boolean_props,
            class_styles
        });
    }

    public static setReasonInputVisible(
        props: DecisionPromptUIPropsInterface,
        show_reason_input: boolean
    ): DecisionPromptUIPropsInterface {
        return this.updateFlatProps(
            props,
            {
                "boolean_props.show_reason_input": show_reason_input
            },
            { create_missing_path: true }
        );
    }

    public static setReasonRequired(
        props: DecisionPromptUIPropsInterface,
        reason_required: boolean
    ): DecisionPromptUIPropsInterface {
        return this.updateFlatProps(
            props,
            {
                "boolean_props.reason_required": reason_required
            },
            { create_missing_path: true }
        );
    }
}

export default DecisionPromptUIPropsBuilder;

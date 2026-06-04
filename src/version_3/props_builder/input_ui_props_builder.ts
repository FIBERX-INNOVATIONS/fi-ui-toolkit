import { reactive } from "vue";

import BasePropSchema from "../base_classes/base_prop_schema";
import ContentManagerUtil from "../utils/content_manager_util";
import InputUIClassStyles from "../class_styles/input_ui_class_styles";

import {
    InputUIPropsInterface,
    InputUIClassStylesInterface,
    InputType,
    InputUIBooleanPropsInterface,
    InputUINumberPropsInterface,
    InputUIFilePropsInterface,
    InputUIActionPropsInterface,
    SelectOptionInterface,
    InputUIContentPayloadInterface
} from "../ui_types/input_ui_type";

class InputUIPropsBuilder extends BasePropSchema<InputUIPropsInterface> {
    public static readonly static_prop_keys = [
        "id",
        "switch_btn_id",
        "type",
        "content_props",
        "number_props",
        "file_props",
        "action_props",
        "class_styles"
    ] satisfies readonly (keyof InputUIPropsInterface)[];

    private static readonly content_manager = ContentManagerUtil.getInstance();

    /* ---------------------------------- */
    /* Global Configuration               */
    /* ---------------------------------- */

    public static class_styles?: InputUIClassStylesInterface;

    public static default_content_props?: InputUIContentPayloadInterface;

    public static default_boolean_props?: InputUIBooleanPropsInterface;

    public static default_number_props?: InputUINumberPropsInterface;

    public static default_file_props?: InputUIFilePropsInterface;

    public static default_action_props?: InputUIActionPropsInterface;

    /* ---------------------------------- */
    /* Setup                              */
    /* ---------------------------------- */

    public static configure(params: {
        class_styles?: InputUIClassStylesInterface;
        action_props?: InputUIActionPropsInterface;
        boolean_props?: InputUIBooleanPropsInterface;
        number_props?: InputUINumberPropsInterface;
        content_props?: InputUIContentPayloadInterface;
        file_props?: InputUIFilePropsInterface;
    }): void {
        InputUIPropsBuilder.class_styles = params.class_styles || InputUIClassStyles;

        InputUIPropsBuilder.default_content_props = params.content_props || {};

        InputUIPropsBuilder.default_boolean_props = params.boolean_props || {};

        InputUIPropsBuilder.default_number_props = params.number_props || {};

        InputUIPropsBuilder.default_file_props = params.file_props || {};

        InputUIPropsBuilder.default_action_props = params.action_props || {};
    }

    /* ---------------------------------- */
    /* Content Fetch                      */
    /* ---------------------------------- */

    private static getContentProps(content_key?: string) {
        if (!content_key) return {};

        return InputUIPropsBuilder.content_manager?.get<InputUIContentPayloadInterface>(content_key) ?? {};
    }

    /* ---------------------------------- */
    /* Build Props                        */
    /* ---------------------------------- */

    private static buildPropsObject(
        id: string,

        type: InputType = "text",

        content_key?: string,

        overrides: Partial<InputUIPropsInterface> = {}
    ): InputUIPropsInterface {
        const content_data = InputUIPropsBuilder.getContentProps(content_key);

        const placeholder_text = overrides.placeholder_text ?? content_data?.placeholder_text ?? "";

        const helper_text = overrides.helper_text ?? content_data?.helper_text ?? "";

        const selected_text_prefix = overrides.selected_text_prefix ?? content_data?.selected_text_prefix ?? "";

        const option_props = overrides.option_props ?? content_data?.options_list ?? [];

        return {
            id,

            type,

            switch_btn_id: overrides.switch_btn_id ?? `${id}_switch`,

            model_value: overrides.model_value ?? null,

            placeholder_text,

            helper_text,

            selected_text_prefix,

            option_props,

            content_props: {
                ...InputUIPropsBuilder.default_content_props,
                ...overrides.content_props
            },

            boolean_props: {
                ...InputUIPropsBuilder.default_boolean_props,
                ...overrides.boolean_props
            },

            number_props: {
                ...InputUIPropsBuilder.default_number_props,
                ...overrides.number_props
            },

            file_props: {
                ...InputUIPropsBuilder.default_file_props,
                ...overrides.file_props
            },

            action_props: {
                ...InputUIPropsBuilder.default_action_props,
                ...overrides.action_props
            },

            class_styles: {
                ...InputUIClassStyles,
                ...(InputUIPropsBuilder.class_styles ?? {}),
                ...(overrides.class_styles ?? {})
            }
        };
    }

    /* ---------------------------------- */
    /* Public Builder                     */
    /* ---------------------------------- */

    public static getReactivePropsObject(
        id: string,

        type: InputType = "text",

        content_key?: string,

        overrides: Partial<InputUIPropsInterface> = {}
    ): InputUIPropsInterface {
        const props = InputUIPropsBuilder.buildPropsObject(id, type, content_key, overrides);

        return this.createReactiveProps<InputUIPropsInterface>(props);
    }

    public static updateValue(
        props: InputUIPropsInterface,
        model_value: InputUIPropsInterface["model_value"]
    ): InputUIPropsInterface {
        return this.updateProp(props, "model_value", model_value);
    }

    public static updatePlaceholder(props: InputUIPropsInterface, placeholder_text: string): InputUIPropsInterface {
        return this.updateProp(props, "placeholder_text", placeholder_text);
    }

    public static updateOptions(
        props: InputUIPropsInterface,
        option_props: SelectOptionInterface[]
    ): InputUIPropsInterface {
        return this.updateProp(props, "option_props", option_props);
    }

    public static setDisabled(props: InputUIPropsInterface, disabled: boolean): InputUIPropsInterface {
        return this.updateFlatProps(
            props,
            {
                "boolean_props.disabled": disabled
            },
            { create_missing_path: true }
        );
    }

    public static setLoading(props: InputUIPropsInterface, is_loading: boolean): InputUIPropsInterface {
        return this.updateFlatProps(
            props,
            {
                "boolean_props.is_loading": is_loading
            },
            { create_missing_path: true }
        );
    }
}

export default InputUIPropsBuilder;

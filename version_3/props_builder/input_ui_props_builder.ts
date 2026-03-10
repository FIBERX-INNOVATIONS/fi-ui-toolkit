import { reactive } from "vue";

import LoggerUtil from "../utils/logger_util";
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

class InputUIPropsBuilder {

    private static readonly name = "input_ui_props_builder";

    private static readonly logger = new LoggerUtil({
        prefix: InputUIPropsBuilder.name,
        show_timestamp: false
    });

    private static readonly content_manager =
        ContentManagerUtil.getInstance();


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

    public static configure(
        class_styles?: InputUIClassStylesInterface,
        action_props?: InputUIActionPropsInterface,
        content_props?: InputUIContentPayloadInterface,
        boolean_props?: InputUIBooleanPropsInterface,
        number_props?: InputUINumberPropsInterface,
        file_props?: InputUIFilePropsInterface,
    ): void {

        InputUIPropsBuilder.class_styles =
            class_styles || InputUIClassStyles;

        InputUIPropsBuilder.default_content_props =
            content_props || {};

        InputUIPropsBuilder.default_boolean_props =
            boolean_props || {};

        InputUIPropsBuilder.default_number_props =
            number_props || {};

        InputUIPropsBuilder.default_file_props =
            file_props || {};

        InputUIPropsBuilder.default_action_props =
            action_props || {};
    }


    /* ---------------------------------- */
    /* Content Fetch                      */
    /* ---------------------------------- */

    private static getContentProps(content_key?: string) {

        if (!content_key) return {};

        return (
            InputUIPropsBuilder.content_manager
                ?.get<InputUIContentPayloadInterface>(content_key) ?? {}
        );

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

        const content_data =
            InputUIPropsBuilder.getContentProps(content_key);

        const placeholder_text =
            overrides.placeholder_text ??
            content_data?.placeholder_text ??
            "";

        const helper_text =
            overrides.helper_text ??
            content_data?.helper_text ??
            "";

        const option_props =
            overrides.option_props ??
            content_data?.options_list ??
            [];

        return {

            id,

            type,

            switch_btn_id:
                overrides.switch_btn_id ??
                `${id}_switch`,

            model_value:
                overrides.model_value ?? null,

            placeholder_text,

            helper_text,

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

            class_styles:
                overrides.class_styles ??
                InputUIPropsBuilder.class_styles ??
                InputUIClassStyles

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

        const props =
            InputUIPropsBuilder.buildPropsObject(
                id,
                type,
                content_key,
                overrides
            );

        return reactive<InputUIPropsInterface>(props);

    }

}

export default InputUIPropsBuilder;
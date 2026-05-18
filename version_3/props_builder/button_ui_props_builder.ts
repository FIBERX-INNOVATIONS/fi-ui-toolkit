import { reactive } from "vue";

import BasePropSchema from "../base_classes/base_prop_schema";
import ContentManagerUtil from "../utils/content_manager_util";
import ButtonUIClassStyles from "../class_styles/button_ui_class_styles";

import {
    ButtonUIPropsInterface,
    ButtonUIClassStylesInterface,
    ButtonUIContentOptionsInterface,
    ButtonUIBooleanPropsInterface,
    ButtonUIActionPropsInterface,
    ButtonType
} from "../ui_types/button_ui_type";
import RenderHtmlUtil from "../utils/render_html_util";
import { SVGIconKey } from "../resources/svg_icon_resource";

class ButtonUIPropsBuilder extends BasePropSchema<ButtonUIPropsInterface> {
    public static readonly static_prop_keys = [
        "id",
        "type",
        "action_props",
        "class_styles"
    ] satisfies readonly (keyof ButtonUIPropsInterface)[];

    private static readonly content_manager = ContentManagerUtil.getInstance();

    public static class_styles?: ButtonUIClassStylesInterface;

    public static default_boolean_props?: ButtonUIBooleanPropsInterface;

    public static default_action_props?: ButtonUIActionPropsInterface;

    /* ---------------------------------- */
    /* Content Fetch                      */
    /* ---------------------------------- */

    private static getContentProps(content_key?: string, record: Record<string, any> = {}): string {
        if (!content_key) return "";

        return ButtonUIPropsBuilder.content_manager?.getWithRecord<string>(content_key, record, "") ?? "";
    }

    public static configure(
        class_styles?: ButtonUIClassStylesInterface,
        action_props?: ButtonUIActionPropsInterface,
        boolean_props?: ButtonUIBooleanPropsInterface
    ): void {
        ButtonUIPropsBuilder.class_styles = class_styles || ButtonUIClassStyles;

        ButtonUIPropsBuilder.default_boolean_props = boolean_props || {};

        ButtonUIPropsBuilder.default_action_props = action_props || {};
    }

    private static buildPropsObject(
        content_key: string,

        id?: string,

        icon_key?: SVGIconKey,

        type: ButtonType = "button",

        overrides: Partial<ButtonUIPropsInterface> = {},

        record: Record<string, any> = {}
    ): ButtonUIPropsInterface {
        const class_styles = overrides.class_styles ?? ButtonUIPropsBuilder.class_styles ?? ButtonUIClassStyles;
        const button_text = ButtonUIPropsBuilder.getContentProps(content_key, record);
        const icon_class_style = class_styles.icon_class_style;
        const text_class_style = class_styles.text_class_style;
        const loading_html_content = RenderHtmlUtil.renderLoaderHtml();
        const button_html_content = RenderHtmlUtil.renderHtml({
            text: button_text,
            icon: icon_key,
            icon_class_style,
            class_style: text_class_style
        });

        const content_props = { loading_html_content, button_html_content };

        return {
            id,

            type,

            content_props: overrides.content_props || content_props,

            boolean_props: {
                ...ButtonUIPropsBuilder.default_boolean_props,
                ...overrides.boolean_props
            },

            action_props: {
                ...ButtonUIPropsBuilder.default_action_props,
                ...overrides.action_props
            },

            class_styles: overrides.class_styles ?? ButtonUIPropsBuilder.class_styles ?? ButtonUIClassStyles
        };
    }

    public static getReactivePropsObject(
        id: string,

        content_key: string,

        icon_key?: SVGIconKey,

        type: ButtonType = "button",

        overrides: Partial<ButtonUIPropsInterface> = {},

        record: Record<string, any> = {}
    ): ButtonUIPropsInterface {
        const props = ButtonUIPropsBuilder.buildPropsObject(content_key, id, icon_key, type, overrides, record);

        return this.createReactiveProps<ButtonUIPropsInterface>(props);
    }

    public static updateText(props: ButtonUIPropsInterface, button_html_content: string): ButtonUIPropsInterface {
        return this.updateFlatProps(props, {
            "content_props.button_html_content": button_html_content
        });
    }

    public static updateLoadingText(
        props: ButtonUIPropsInterface,
        loading_html_content: string
    ): ButtonUIPropsInterface {
        return this.updateFlatProps(props, {
            "content_props.loading_html_content": loading_html_content
        });
    }

    public static setDisabled(props: ButtonUIPropsInterface, disabled: boolean): ButtonUIPropsInterface {
        return this.updateFlatProps(
            props,
            {
                "boolean_props.disabled": disabled
            },
            { create_missing_path: true }
        );
    }
}

export default ButtonUIPropsBuilder;

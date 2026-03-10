
import { reactive } from "vue";

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


class ButtonUIPropsBuilder {

    private static readonly content_manager =
        ContentManagerUtil.getInstance();

    public static class_styles?: ButtonUIClassStylesInterface;

    public static default_boolean_props?: ButtonUIBooleanPropsInterface;

    public static default_action_props?: ButtonUIActionPropsInterface;

    /* ---------------------------------- */
    /* Content Fetch                      */
    /* ---------------------------------- */

    private static getContentProps(content_key?: string): string {

        if (!content_key) return "";

        return (
            ButtonUIPropsBuilder.content_manager?.get<string>(content_key) ?? ""
        );

    }


    public static configure(
        class_styles?: ButtonUIClassStylesInterface,
        action_props?: ButtonUIActionPropsInterface,
        boolean_props?: ButtonUIBooleanPropsInterface,
    ): void {

        ButtonUIPropsBuilder.class_styles =
            class_styles || ButtonUIClassStyles;

        ButtonUIPropsBuilder.default_boolean_props =
            boolean_props || {};

        ButtonUIPropsBuilder.default_action_props =
            action_props || {};

    }


    private static buildPropsObject(
        content_key: string,

        id?: string,

        icon_key?: SVGIconKey,

        type: ButtonType = "button",

        overrides: Partial<ButtonUIPropsInterface> = {}

    ): ButtonUIPropsInterface {

        const class_styles          = overrides.class_styles ?? ButtonUIPropsBuilder.class_styles ?? ButtonUIClassStyles
        const button_text           = ButtonUIPropsBuilder.getContentProps(content_key);
        const icon_class_style      = class_styles.icon_class_style;
        const text_class_style      = class_styles.text_class_style;
        const loading_html_content  = RenderHtmlUtil.renderLoaderHtml();
        const button_html_content   = RenderHtmlUtil.renderHtml({
            text: button_text, icon: icon_key, icon_class_style,
            class_style: text_class_style
        })

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

            class_styles:
                overrides.class_styles ??
                ButtonUIPropsBuilder.class_styles ??
                ButtonUIClassStyles

        };

    }


    public static getReactivePropsObject(

        id: string,

        content_key: string,

        icon_key?: SVGIconKey,

        type: ButtonType = "button",

        overrides: Partial<ButtonUIPropsInterface> = {}

    ): ButtonUIPropsInterface {

        const props =
            ButtonUIPropsBuilder.buildPropsObject(
                content_key,
                id,
                icon_key,
                type,
                overrides
            );

        return reactive<ButtonUIPropsInterface>(props);

    }

}

export default ButtonUIPropsBuilder;
import BasePropSchema from "../base_classes/base_prop_schema";
import ContentManagerUtil from "../utils/content_manager_util";
import ContentCardUIClassStyles from "../class_styles/content_card_ui_class_styles";

import {
    ContentCardUIActionPropsInterface,
    ContentCardUIBooleanPropsInterface,
    ContentCardUIClassStylesInterface,
    ContentCardUIContentPathPropsInterface,
    ContentCardUIContentPropsInterface,
    ContentCardUIDataPropsInterface,
    ContentCardUIPropsInterface
} from "../ui_types/content_card_ui_type";

/* Method to build and update reactive ContentCardUI props. */
class ContentCardUIPropsBuilder extends BasePropSchema<ContentCardUIPropsInterface> {
    public static readonly static_prop_keys = [
        "id",
        "action_props",
        "class_styles"
    ] satisfies readonly (keyof ContentCardUIPropsInterface)[];

    private static readonly content_manager = ContentManagerUtil.getInstance();

    public static class_styles?: ContentCardUIClassStylesInterface;

    public static default_boolean_props?: ContentCardUIBooleanPropsInterface;

    public static default_data_props?: ContentCardUIDataPropsInterface;

    public static default_action_props?: ContentCardUIActionPropsInterface;

    /* Method to configure default ContentCardUI props. */
    public static configure(params: {
        class_styles?: ContentCardUIClassStylesInterface;
        boolean_props?: ContentCardUIBooleanPropsInterface;
        data_props?: ContentCardUIDataPropsInterface;
        action_props?: ContentCardUIActionPropsInterface;
    }): void {
        ContentCardUIPropsBuilder.class_styles = params.class_styles || ContentCardUIClassStyles;
        ContentCardUIPropsBuilder.default_boolean_props = params.boolean_props || {};
        ContentCardUIPropsBuilder.default_data_props = params.data_props || {};
        ContentCardUIPropsBuilder.default_action_props = params.action_props || {};
    }

    /* Method to build the complete ContentCardUI props object. */
    private static buildPropsObject(
        id: string,
        content_props: ContentCardUIContentPropsInterface = {},
        overrides: Partial<ContentCardUIPropsInterface> = {}
    ): ContentCardUIPropsInterface {
        return {
            id,

            content_props: {
                ...content_props,
                ...overrides.content_props
            },

            data_props: {
                ...ContentCardUIPropsBuilder.default_data_props,
                ...overrides.data_props
            },

            boolean_props: {
                lazy_load: true,
                video_controls: true,
                ...ContentCardUIPropsBuilder.default_boolean_props,
                ...overrides.boolean_props
            },

            action_props: {
                ...ContentCardUIPropsBuilder.default_action_props,
                ...overrides.action_props
            },

            class_styles: {
                ...ContentCardUIClassStyles,
                ...(ContentCardUIPropsBuilder.class_styles ?? {}),
                ...(overrides.class_styles ?? {})
            }
        };
    }

    /* Method to create reactive ContentCardUI props from direct values. */
    public static getReactivePropsObject(
        id: string,
        overrides: Partial<ContentCardUIPropsInterface> = {}
    ): ContentCardUIPropsInterface {
        const props = ContentCardUIPropsBuilder.buildPropsObject(id, {}, overrides);

        return this.createReactiveProps<ContentCardUIPropsInterface>(props);
    }

    /* Method to create reactive ContentCardUI props from content manager paths. */
    public static getReactivePropsObjectFromContentPaths(
        id: string,
        content_paths: ContentCardUIContentPathPropsInterface = {},
        overrides: Partial<ContentCardUIPropsInterface> = {},
        record: Record<string, any> = {}
    ): ContentCardUIPropsInterface {
        const content_props = ContentCardUIPropsBuilder.getContentPropsFromPaths(content_paths, record);
        const props = ContentCardUIPropsBuilder.buildPropsObject(id, content_props, overrides);

        return this.createReactiveProps<ContentCardUIPropsInterface>(props);
    }

    /* Method to update the displayed title text. */
    public static updateTitleText(props: ContentCardUIPropsInterface, title_text: string): ContentCardUIPropsInterface {
        return this.updateFlatProps(
            props,
            {
                "content_props.title_text": title_text
            },
            { create_missing_path: true }
        );
    }

    /* Method to update the displayed title icon. */
    public static updateTitleIcon(
        props: ContentCardUIPropsInterface,
        title_icon: ContentCardUIContentPropsInterface["title_icon"]
    ): ContentCardUIPropsInterface {
        return this.updateFlatProps(
            props,
            {
                "content_props.title_icon": title_icon
            },
            { create_missing_path: true, allow_undefined: true }
        );
    }

    /* Method to update the displayed title icon position. */
    public static updateTitleIconPosition(
        props: ContentCardUIPropsInterface,
        title_icon_position: ContentCardUIContentPropsInterface["title_icon_position"]
    ): ContentCardUIPropsInterface {
        return this.updateFlatProps(
            props,
            {
                "content_props.title_icon_position": title_icon_position
            },
            { create_missing_path: true }
        );
    }

    /* Method to update the displayed description text. */
    public static updateDescriptionText(
        props: ContentCardUIPropsInterface,
        description_text: string
    ): ContentCardUIPropsInterface {
        return this.updateFlatProps(
            props,
            {
                "content_props.description_text": description_text
            },
            { create_missing_path: true }
        );
    }

    /* Method to update the displayed media link. */
    public static updateMediaLink(props: ContentCardUIPropsInterface, media_link: string): ContentCardUIPropsInterface {
        return this.updateFlatProps(
            props,
            {
                "content_props.media_link": media_link
            },
            { create_missing_path: true }
        );
    }

    /* Method to update the displayed button text. */
    public static updateButtonText(
        props: ContentCardUIPropsInterface,
        button_text: string
    ): ContentCardUIPropsInterface {
        return this.updateFlatProps(
            props,
            {
                "content_props.button_text": button_text
            },
            { create_missing_path: true }
        );
    }

    /* Method to update the disabled state. */
    public static setDisabled(props: ContentCardUIPropsInterface, disabled: boolean): ContentCardUIPropsInterface {
        return this.updateFlatProps(
            props,
            {
                "boolean_props.disabled": disabled
            },
            { create_missing_path: true }
        );
    }

    /* Method to fetch content values from dotted content manager paths. */
    private static getContentPropsFromPaths(
        content_paths: ContentCardUIContentPathPropsInterface,
        record: Record<string, any> = {}
    ): ContentCardUIContentPropsInterface {
        return {
            title_text: this.getTextContent(content_paths.title_text, record),
            title_icon: this.getIconContent(content_paths.title_icon),
            description_text: this.getTextContent(content_paths.description_text, record),
            media_link: this.getTextContent(content_paths.media_link, record),
            media_description_text: this.getTextContent(content_paths.media_description_text, record),
            button_text: this.getTextContent(content_paths.button_text, record),
            button_icon: this.getIconContent(content_paths.button_icon)
        };
    }

    /* Method to fetch a string content value. */
    private static getTextContent(content_key?: string, record: Record<string, any> = {}): string {
        if (!content_key) {
            return "";
        }

        return ContentCardUIPropsBuilder.content_manager.getWithRecord<string>(content_key, record, "") ?? "";
    }

    /* Method to fetch an icon key content value. */
    private static getIconContent(content_key?: string): ContentCardUIContentPropsInterface["button_icon"] {
        if (!content_key) {
            return undefined;
        }

        return (
            ContentCardUIPropsBuilder.content_manager.get<ContentCardUIContentPropsInterface["button_icon"]>(
                content_key,
                undefined
            ) ?? undefined
        );
    }
}

export default ContentCardUIPropsBuilder;

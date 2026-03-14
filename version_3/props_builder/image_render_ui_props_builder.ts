import { reactive } from "vue";

import ImageRenderUIClassStyles from "../class_styles/image_render_ui_class_styles";

import {
    ImageRenderUIPropsInterface,
    ImageRenderUIClassStylesInterface,
    ImageRenderUIBooleanPropsInterface,
    ImageRenderUIActionPropsInterface,
    ImagePayloadInterface
} from "../ui_types/image_render_ui_type";

import ContentManagerUtil from "../utils/content_manager_util";


class ImageRenderUIPropsBuilder {

    public static class_styles?: ImageRenderUIClassStylesInterface;

    public static default_boolean_props?: ImageRenderUIBooleanPropsInterface;

    public static default_action_props?: ImageRenderUIActionPropsInterface;


    public static configure(

        class_styles?: ImageRenderUIClassStylesInterface,

        boolean_props?: ImageRenderUIBooleanPropsInterface,

        action_props?: ImageRenderUIActionPropsInterface

    ): void {

        ImageRenderUIPropsBuilder.class_styles =
            class_styles || ImageRenderUIClassStyles;

        ImageRenderUIPropsBuilder.default_boolean_props =
            boolean_props || {};

        ImageRenderUIPropsBuilder.default_action_props =
            action_props || {};

    }


    private static buildPropsObject(

        id: string,

        src: string,

        overrides: Partial<ImageRenderUIPropsInterface> = {}

    ): ImageRenderUIPropsInterface {

        return {

            id,

            src,

            alt_text: overrides.alt_text ?? "",

            content: overrides.content ?? "",

            boolean_props: {
                ...ImageRenderUIPropsBuilder.default_boolean_props,
                ...overrides.boolean_props
            },

            action_props: {
                ...ImageRenderUIPropsBuilder.default_action_props,
                ...overrides.action_props
            },

            class_styles:
                overrides.class_styles ??
                ImageRenderUIPropsBuilder.class_styles ??
                ImageRenderUIClassStyles

        };

    }


    public static getReactivePropsObject(

        id: string,

        src: string,

        overrides: Partial<ImageRenderUIPropsInterface> = {}

    ): ImageRenderUIPropsInterface {

        const props =
            ImageRenderUIPropsBuilder.buildPropsObject(
                id,
                src,
                overrides
            );

        return reactive<ImageRenderUIPropsInterface>(props);

    }

    public static getReactivePropsObjectFromContent (
        id: string,

        content_key: string,

        overrides: Partial<ImageRenderUIPropsInterface> = {}

    ): ImageRenderUIPropsInterface {
        const content_manager = ContentManagerUtil.getInstance();
        const content_payload = content_manager.get<ImagePayloadInterface>(content_key);

        const { img_link, img_alt_text = "" } = content_payload || {};

        if(!img_link) { return {} }

        const props =
            ImageRenderUIPropsBuilder.buildPropsObject(
                id,
                img_link,
                {
                    ...overrides,
                    alt_text: img_alt_text
                }
            );

        return reactive<ImageRenderUIPropsInterface>(props);

    }

}

export default ImageRenderUIPropsBuilder;
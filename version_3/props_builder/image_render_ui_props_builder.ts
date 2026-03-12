import { reactive } from "vue";

import ImageRenderUIClassStyles from "../class_styles/image_render_ui_class_styles";

import {
    ImageRenderUIPropsInterface,
    ImageRenderUIClassStylesInterface,
    ImageRenderUIBooleanPropsInterface,
    ImageRenderUIActionPropsInterface
} from "../ui_types/image_render_ui_type";


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

}

export default ImageRenderUIPropsBuilder;
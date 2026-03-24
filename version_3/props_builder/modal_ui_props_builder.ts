import { reactive } from "vue";

import ModalUIClassStyles from "../class_styles/modal_ui_class_styles";

import { OverlayUIPropsInterface } from "../ui_types/overlay_ui_type";

import {
    ModalUIPropsInterface,
    ModalUIClassStylesInterface,
    ModalAnimationType,
    ModalUIActionPropsInterface,
    ModalUIContentPropsInterface,
    ConfigureDefaultModalPropsBuilderInterface,
    ModalUIContentPayloadInterface
} from "../ui_types/modal_ui_type";

import ContentManagerUtil from "../utils/content_manager_util";


class ModalUIPropsBuilder {

    public static class_styles?: ModalUIClassStylesInterface;

    public static default_overlay_props?: OverlayUIPropsInterface;

    public static default_action_props?: ModalUIActionPropsInterface;

    public static default_animation_type?: ModalAnimationType;

    public static default_content_props?: ModalUIContentPropsInterface;


    public static configure(
        params: ConfigureDefaultModalPropsBuilderInterface = {}
    ): void {
        const {
            class_styles,
            default_overlay_props,
            default_action_props,
            default_animation_type,
            default_content_props
        } = params

        ModalUIPropsBuilder.class_styles =
            class_styles || ModalUIClassStyles;

        ModalUIPropsBuilder.default_action_props =
            default_action_props || {};

        ModalUIPropsBuilder.default_animation_type =
            default_animation_type;

        ModalUIPropsBuilder.default_content_props =
            default_content_props || {};

        ModalUIPropsBuilder.default_overlay_props = default_overlay_props || {};

    }


    private static buildPropsObject(

        modal_index: number,

        overrides: Partial<ModalUIPropsInterface> = {}

    ): ModalUIPropsInterface {

        return {

            overlay_props: {
                 ...ModalUIPropsBuilder.default_overlay_props,
                ...overrides.overlay_props
            },

            title_text: overrides.title_text ?? "",

            title_icon: overrides.title_icon ?? null,

            title_img: overrides.title_img ?? "",

            animation_type: overrides.animation_type ??  ModalUIPropsBuilder.default_animation_type ?? "fade",

            layer: modal_index ?? overrides.layer ?? 1,

            action_props: {
                ...ModalUIPropsBuilder.default_action_props,
                ...overrides.action_props
            },

            class_styles: {
                ...ModalUIClassStyles,
                ...ModalUIPropsBuilder.class_styles,
                ...overrides.class_styles
            },

            content_props: {
                ...ModalUIPropsBuilder.default_content_props,
                ...overrides.content_props
            },

        };

    }


    public static getReactivePropsObject(
        modal_index: number,

        overrides: Partial<ModalUIPropsInterface> = {}

    ): ModalUIPropsInterface {

        const props =
            ModalUIPropsBuilder.buildPropsObject(
                modal_index,
                overrides
            );

        return reactive<ModalUIPropsInterface>(props);

    }

    public static getReactivePropsObjectFromContentData(
        modal_index: number,

        content_key: string,

        overrides: Partial<ModalUIPropsInterface> = {}

    ): ModalUIPropsInterface {

        const content_manager = ContentManagerUtil.getInstance();
        const modal_content = content_manager.get?.<ModalUIContentPayloadInterface>(content_key, null) ?? null;

        if(!modal_content) { return {} }

        const {
            title_text,
            title_img,
            title_icon
        } = modal_content

        const props =
            ModalUIPropsBuilder.buildPropsObject(
                modal_index,
                {
                    ...overrides,
                    title_text,
                    title_img, 
                    title_icon
                }
            );

        return reactive<ModalUIPropsInterface>(props);

    }

}

export default ModalUIPropsBuilder;
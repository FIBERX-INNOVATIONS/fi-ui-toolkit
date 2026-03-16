import { reactive } from "vue";

import ModalUIClassStyles from "../class_styles/modal_ui_class_styles";

import {
    ModalUIPropsInterface,
    ModalUIClassStylesInterface,
    ModalAnimationType,
    ModalUIActionPropsInterface
} from "../ui_types/modal_ui_type";


class ModalUIPropsBuilder {

    public static class_styles?: ModalUIClassStylesInterface;

    public static default_action_props?: ModalUIActionPropsInterface;


    public static configure(

        class_styles?: ModalUIClassStylesInterface,

        action_props?: ModalUIActionPropsInterface

    ): void {

        ModalUIPropsBuilder.class_styles =
            class_styles || ModalUIClassStyles;

        ModalUIPropsBuilder.default_action_props =
            action_props || {};

    }


    private static buildPropsObject(

        id: string,

        overlay_id: string,

        overrides: Partial<ModalUIPropsInterface> = {}

    ): ModalUIPropsInterface {

        return {

            id,

            overlay_id,

            title_text: overrides.title_text ?? "",

            title_icon: overrides.title_icon ?? null,

            title_img: overrides.title_img ?? "",

            animation_type: overrides.animation_type ?? "fade",

            layer: overrides.layer ?? 1,

            action_props: {
                ...ModalUIPropsBuilder.default_action_props,
                ...overrides.action_props
            },

            class_styles:
                overrides.class_styles ??
                ModalUIPropsBuilder.class_styles ??
                ModalUIClassStyles

        };

    }


    public static getReactivePropsObject(

        id: string,

        overlay_id: string,

        overrides: Partial<ModalUIPropsInterface> = {}

    ): ModalUIPropsInterface {

        const props =
            ModalUIPropsBuilder.buildPropsObject(
                id,
                overlay_id,
                overrides
            );

        return reactive<ModalUIPropsInterface>(props);

    }

}

export default ModalUIPropsBuilder;
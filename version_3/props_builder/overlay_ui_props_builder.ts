import { reactive } from "vue";

import OverlayUIClassStyles from "../class_styles/overlay_ui_class_styles";

import {
    OverlayUIPropsInterface,
    OverlayUIClassStylesInterface,
    OverlayUIBooleanPropsInterface,
    OverlayUIActionPropsInterface
} from "../ui_types/overlay_ui_type";


class OverlayUIPropsBuilder {

    public static class_styles?: OverlayUIClassStylesInterface;

    public static default_boolean_props?: OverlayUIBooleanPropsInterface;

    public static default_action_props?: OverlayUIActionPropsInterface;


    public static configure(

        class_styles?: OverlayUIClassStylesInterface,

        boolean_props?: OverlayUIBooleanPropsInterface,

        action_props?: OverlayUIActionPropsInterface

    ): void {

        OverlayUIPropsBuilder.class_styles =
            class_styles || OverlayUIClassStyles;

        OverlayUIPropsBuilder.default_boolean_props =
            boolean_props || {};

        OverlayUIPropsBuilder.default_action_props =
            action_props || {};

    }


    private static buildPropsObject(

        id: string,

        overrides: Partial<OverlayUIPropsInterface> = {}

    ): OverlayUIPropsInterface {

        return {

            id,

            model_value: overrides.model_value ?? false,

            boolean_props: {
                ...OverlayUIPropsBuilder.default_boolean_props,
                ...overrides.boolean_props
            },

            action_props: {
                ...OverlayUIPropsBuilder.default_action_props,
                ...overrides.action_props
            },

            class_styles:
                overrides.class_styles ??
                OverlayUIPropsBuilder.class_styles ??
                OverlayUIClassStyles

        };

    }


    public static getReactivePropsObject(

        id: string,

        overrides: Partial<OverlayUIPropsInterface> = {}

    ): OverlayUIPropsInterface {

        const props =
            OverlayUIPropsBuilder.buildPropsObject(
                id,
                overrides
            );

        return reactive<OverlayUIPropsInterface>(props);

    }


    /* ---------------------------------- */
    /* Overlay Controls                   */
    /* ---------------------------------- */

    public static openOverlay(id: string): void {

        const el = document.getElementById(id);

        if (el) {

            el.style.display = "block";

            document.body.style.overflow = "hidden";

        }

    }

    public static closeOverlay(id: string): void {

        const el = document.getElementById(id);

        if (el) {

            el.style.display = "none";

            document.body.style.overflow = "";

        }

    }

}

export default OverlayUIPropsBuilder;
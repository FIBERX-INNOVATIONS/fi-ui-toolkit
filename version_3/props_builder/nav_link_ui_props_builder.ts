import { reactive } from "vue";

import BasePropSchema from "../base_classes/base_prop_schema";
import NavLinkUIClassStyles from "../class_styles/nav_link_ui_class_styles";

import {
    NavLinkUIPropsInterface,
    NavLinkUIClassStylesInterface,
    NavLinkUIActionPropsInterface
} from "../ui_types/nav_link_ui_type";

class NavLinkUIPropsBuilder extends BasePropSchema<NavLinkUIPropsInterface> {
    public static readonly static_prop_keys = [
        "id",
        "action_props",
        "class_styles"
    ] satisfies readonly (keyof NavLinkUIPropsInterface)[];

    public static class_styles?: NavLinkUIClassStylesInterface;

    public static default_action_props?: NavLinkUIActionPropsInterface;

    public static configure(
        class_styles?: NavLinkUIClassStylesInterface,

        action_props?: NavLinkUIActionPropsInterface
    ): void {
        NavLinkUIPropsBuilder.class_styles = class_styles || NavLinkUIClassStyles;

        NavLinkUIPropsBuilder.default_action_props = action_props || {};
    }

    private static buildPropsObject(
        id?: string,

        link?: string,

        overrides: Partial<NavLinkUIPropsInterface> = {}
    ): NavLinkUIPropsInterface {
        return {
            id,

            link,

            icon: overrides.icon ?? null,

            img_src: overrides.img_src ?? "",

            img_alt_text: overrides.img_alt_text ?? "",

            content: overrides.content ?? "",

            action_props: {
                ...NavLinkUIPropsBuilder.default_action_props,
                ...overrides.action_props
            },

            class_styles: overrides.class_styles ?? NavLinkUIPropsBuilder.class_styles ?? NavLinkUIClassStyles
        };
    }

    public static getReactivePropsObject(
        id?: string,

        link?: string,

        overrides: Partial<NavLinkUIPropsInterface> = {}
    ): NavLinkUIPropsInterface {
        const props = NavLinkUIPropsBuilder.buildPropsObject(id, link, overrides);

        return this.createReactiveProps<NavLinkUIPropsInterface>(props);
    }
}

export default NavLinkUIPropsBuilder;

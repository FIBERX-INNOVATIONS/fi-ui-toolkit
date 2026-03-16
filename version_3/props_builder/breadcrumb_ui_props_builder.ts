import { reactive } from "vue";

import BreadcrumbUIClassStyles from "../class_styles/breadcrumb_ui_class_styles";

import {
    BreadcrumbUIPropsInterface,
    BreadcrumbUIClassStylesInterface
} from "../ui_types/breadcrumb_ui_type";

import { NavLinkUIPropsInterface } from "../ui_types/nav_link_ui_type";

import ContentManagerUtil from "../utils/content_manager_util";

import { ContentMenuPayloadInterface } from "../ui_types/dropdown_menu_ui_type";

import NavLinkUIPropsBuilder from "./nav_link_ui_props_builder";

import { SVGIconKey } from "../resources/svg_icon_resource";


class BreadcrumbUIPropsBuilder {

    public static class_styles?: BreadcrumbUIClassStylesInterface;


    public static configure(
        class_styles?: BreadcrumbUIClassStylesInterface
    ): void {

        BreadcrumbUIPropsBuilder.class_styles =
            class_styles || BreadcrumbUIClassStyles;

    }


    private static buildPropsObject(

        id: string,

        breadcrumb_items: NavLinkUIPropsInterface[],

        overrides: Partial<BreadcrumbUIPropsInterface> = {}

    ): BreadcrumbUIPropsInterface {

        return {

            id,

            breadcrumb_items,

            separator: overrides.separator ?? "/",

            class_styles:
                overrides.class_styles ??
                BreadcrumbUIPropsBuilder.class_styles ??
                BreadcrumbUIClassStyles

        };

    }


    public static getReactivePropsObject(

        id: string,

        breadcrumb_items: NavLinkUIPropsInterface[],

        overrides: Partial<BreadcrumbUIPropsInterface> = {}

    ): BreadcrumbUIPropsInterface {

        const props =
            BreadcrumbUIPropsBuilder.buildPropsObject(
                id,
                breadcrumb_items,
                overrides
            );

        return reactive<BreadcrumbUIPropsInterface>(props);

    }

    public static getReactivePropsObjectFromContent (
        id: string,
        content_key: string,
        separator?: string,
        class_styles?: BreadcrumbUIClassStylesInterface,
    ): BreadcrumbUIPropsInterface {
        if(!content_key) { return { breadcrumb_items: [] } }

        const content_manager   = ContentManagerUtil.getInstance()
        const content_payload   = content_manager.get<ContentMenuPayloadInterface[]>(content_key);

        if(!content_payload || !content_payload.length) { return { breadcrumb_items: [] } }

        const nav_links = [];

        for ( const payload of content_payload) {
            const {
                menu_text = "",
                menu_link,
                menu_icon,
                menu_id_text = "",
                menu_img_link,
            } = payload;

            const nav_link_item = NavLinkUIPropsBuilder.getReactivePropsObject(
                menu_id_text ?? "",
                menu_link,
                {
                    icon: (menu_icon) as SVGIconKey,
                    img_src: menu_img_link,
                    img_alt_text: menu_text,
                    content: menu_text,
                    class_styles: class_styles?.nav_link_class_styles
                }
            )

            nav_links.push(nav_link_item);
        }

        return BreadcrumbUIPropsBuilder.getReactivePropsObject(
            id, 
            nav_links, 
            {
                class_styles,
                separator,
            }
        )
    }

}

export default BreadcrumbUIPropsBuilder;
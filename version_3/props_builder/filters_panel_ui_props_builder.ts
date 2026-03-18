import { reactive } from "vue";

import FiltersPanelUIClassStyles from "../class_styles/filters_panel_ui_class_styles";

import {
    FiltersPanelUIPropsInterface,
    FiltersPanelUIClassStylesInterface,
    FilterFieldConfigInterface
} from "../ui_types/filters_panel_ui_type";

import { ButtonUIPropsInterface } from "../ui_types/button_ui_type";
import ContentManagerUtil from "../utils/content_manager_util";
import RenderHtmlUtil from "../utils/render_html_util";
import { SVGIconKey } from "../resources/svg_icon_resource";


class FiltersPanelUIPropsBuilder {

    public static class_styles?: FiltersPanelUIClassStylesInterface;


    public static configure(
        class_styles?: FiltersPanelUIClassStylesInterface
    ) {

        FiltersPanelUIPropsBuilder.class_styles =
            class_styles || FiltersPanelUIClassStyles;

    }


    private static buildPropsObject(
        toggle_btn_content: string,

        filters: FilterFieldConfigInterface[],

        apply_button: ButtonUIPropsInterface,

        clear_button: ButtonUIPropsInterface,

        class_styles: FiltersPanelUIClassStylesInterface,

        overrides: Partial<FiltersPanelUIPropsInterface> = {}

    ): FiltersPanelUIPropsInterface {

        return {

            toggle_btn_content,

            filter_fields: filters,

            apply_button,

            clear_button,

            sync_route_query: true,

            class_styles
        }

    }


    public static getReactivePropsObject(

        toggle_btn_label_content_key: string,

        toggle_btn_label_icon_content_key: string,

        filters: FilterFieldConfigInterface[],

        apply_button: ButtonUIPropsInterface,

        clear_button: ButtonUIPropsInterface,

        overrides: Partial<FiltersPanelUIPropsInterface> = {}

    ): FiltersPanelUIPropsInterface {
        const overide_class_style       = overrides.class_styles || {};
        const configured_class_style    = FiltersPanelUIPropsBuilder?.class_styles || {};
        const class_styles              = { ...FiltersPanelUIClassStyles, ...configured_class_style, ...overide_class_style };
        const content_manager           = ContentManagerUtil.getInstance();
        const toggle_btn_label_text     = content_manager.get<string>(toggle_btn_label_content_key, toggle_btn_label_content_key) ?? "";
        const toggle_btn_icon_text      = content_manager.get<string>(toggle_btn_label_icon_content_key, toggle_btn_label_icon_content_key) ?? "";

        const toggle_btn_content    = RenderHtmlUtil.renderHtml({
            text: toggle_btn_label_text,
            icon: (toggle_btn_icon_text as SVGIconKey) ?? "horizontal_filters_svg_icon",
            icon_class_style: class_styles.toggle_btn_icon_class_style,
            class_style: class_styles.toggle_btn_content_wrapper_class_style,

        })

        const props =
            FiltersPanelUIPropsBuilder.buildPropsObject(
                toggle_btn_content,
                filters,
                apply_button,
                clear_button,
                class_styles,
                overrides
            );

        return reactive(props);

    }

}

export default FiltersPanelUIPropsBuilder;
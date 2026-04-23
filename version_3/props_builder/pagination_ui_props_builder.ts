import { reactive } from "vue";

import PaginationUIClassStyles from "../class_styles/pagination_ui_class_styles";

import {
    PaginationUIPropsInterface,
    PaginationUIClassStylesInterface,
    PaginationUIDataPropsInterface,
    PaginationUIConfigPropsInterface,
    PaginationUIContentPropsInterface,
    PaginationLayoutType,
    PaginationUIBtnContentPayload
} from "../ui_types/pagination_ui_type";

import ContentManagerUtil from "../utils/content_manager_util";

class PaginationUIPropsBuilder {
    private static readonly content_manager = ContentManagerUtil.getInstance();
    public static class_styles?: PaginationUIClassStylesInterface;
    public static default_layout: PaginationLayoutType = "center";
    public static default_config?: PaginationUIConfigPropsInterface;
    public static default_content?: PaginationUIContentPropsInterface;

    private static getBtnContentPayload(content_key?: string): PaginationUIBtnContentPayload {
        const defualt_content_payload = { prev_btn_text: "", next_btn_text: "" }

        if (!content_key) return defualt_content_payload;

        
        return (
            PaginationUIPropsBuilder.content_manager?.get<PaginationUIBtnContentPayload>(content_key) ?? defualt_content_payload
        );

    }

    public static configure(params: {
        class_styles?: PaginationUIClassStylesInterface,
        layout?: PaginationLayoutType,
        config?: PaginationUIConfigPropsInterface,
        content?: PaginationUIContentPropsInterface
    }) {

        const {
            class_styles,
            layout = "center",
            config,
            content
        } = params

        this.class_styles = class_styles || PaginationUIClassStyles;
        this.default_layout = layout;
        this.default_config = config || { show_numbers: true, max_visible_pages: 5 };
        this.default_content = content || {};
    }

    private static buildPropsObject(
        id: string,
        data_props: PaginationUIDataPropsInterface,
        overrides: Partial<PaginationUIPropsInterface> = {}
    ): PaginationUIPropsInterface {

        return {

            id,

            layout: overrides.layout ?? this.default_layout,

            data_props,

            config_props: {
                ...this.default_config,
                ...overrides.config_props
            },

            content_props: {
                ...this.default_content,
                ...overrides.content_props
            },

            action_props: overrides.action_props,

            class_styles:
                overrides.class_styles ??
                this.class_styles ??
                PaginationUIClassStyles

        };

    }

    public static getReactivePropsObject(
        id: string,

        content_key: string,

        current_page: number,

        total_pages: number,

        overrides: Partial<PaginationUIPropsInterface> = {
            content_props: { next_btn_text: "", prev_btn_text: "" }
        }
    ): PaginationUIPropsInterface {

        const content_payload = this.getBtnContentPayload(content_key);

        const data_props = { current_page, total_pages };

        if(overrides.content_props) {
            overrides.content_props.next_btn_text = content_payload.next_btn_text;
            overrides.content_props.prev_btn_text = content_payload.prev_btn_text;
        }

        const props = this.buildPropsObject(id, data_props, overrides);

        return reactive<PaginationUIPropsInterface>(props);
    }

}

export default PaginationUIPropsBuilder;
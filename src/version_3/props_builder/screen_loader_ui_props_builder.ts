import { reactive, Ref } from "vue";

import BasePropSchema from "../base_classes/base_prop_schema";
import ContentManagerUtil from "../utils/content_manager_util";

import {
    LoaderSymbolInterface,
    ScreenLoaderUIClassStylesInterface,
    ScreenLoaderUIPropsInterface,
    ScreenLoaderUIContentPayloadInterface
} from "../ui_types/screen_loader_ui_type";

import ScreenLoaderUIClassStyles from "../class_styles/screen_loader_ui_class_styles";

class ScreenLoaderUIPropsBuilder extends BasePropSchema<ScreenLoaderUIPropsInterface> {
    public static default_class_styles: ScreenLoaderUIClassStylesInterface;

    public static default_loading_text?: string;

    public static default_content_data_key: string = "content_resource.screen_loader_ui";

    public static readonly static_prop_keys = [
        "class_styles",
        "loader_symbol"
    ] satisfies readonly (keyof ScreenLoaderUIPropsInterface)[];

    private static readonly content_manager: ContentManagerUtil = ContentManagerUtil.getInstance();

    // Method to configure props builder
    public static configure(params: {
        class_styles?: ScreenLoaderUIClassStylesInterface;
        loading_text?: string;
        content_data_key?: string;
    }): void {
        const { class_styles, loading_text, content_data_key } = params;

        if (content_data_key) {
            ScreenLoaderUIPropsBuilder.default_content_data_key = content_data_key;
        }

        ScreenLoaderUIPropsBuilder.default_class_styles = class_styles || ScreenLoaderUIClassStyles;
        ScreenLoaderUIPropsBuilder.default_loading_text = loading_text;
    }

    // Method to build props object
    private static buildPropsObject(
        visible: boolean = false,
        loading_text?: string,
        content_data_key: string = "content_resource.screen_loader_ui",
        class_styles?: ScreenLoaderUIClassStylesInterface
    ): ScreenLoaderUIPropsInterface {
        const actual_content_data_key = content_data_key || ScreenLoaderUIPropsBuilder.default_content_data_key;
        const actual_loading_text = loading_text || ScreenLoaderUIPropsBuilder.default_loading_text;
        const default_class_styles = ScreenLoaderUIPropsBuilder.default_class_styles ?? ScreenLoaderUIClassStyles;
        const merged_class_styles = { ...default_class_styles, ...class_styles };

        const content_data =
            ScreenLoaderUIPropsBuilder.content_manager?.get<ScreenLoaderUIContentPayloadInterface>(
                actual_content_data_key
            ) ?? {};

        const { img_src_link = "", img_alt_text = "", loader_text = "" } = content_data;

        const loader_symbol: LoaderSymbolInterface = {
            type: "img",
            src: img_src_link ?? "",
            class_style: merged_class_styles?.loader_symbol_img_class_style,
            alt_text: img_alt_text ?? ""
        };

        const _load_text = actual_loading_text ?? loader_text ?? "";

        return {
            visible,
            loader_symbol,
            loader_text: _load_text,
            class_styles: merged_class_styles
        };
    }

    // Method to get reactive props object
    public static getReactivePropsObject(
        visible: boolean = false,
        class_styles?: ScreenLoaderUIClassStylesInterface,
        loading_text?: string,
        content_data_key: string = "content_resource.screen_loader_ui"
    ): ScreenLoaderUIPropsInterface {
        const props_obj = ScreenLoaderUIPropsBuilder.buildPropsObject(
            visible,
            loading_text,
            content_data_key,
            class_styles
        );
        return this.createReactiveProps<ScreenLoaderUIPropsInterface>(props_obj);
    }
}

export default ScreenLoaderUIPropsBuilder;

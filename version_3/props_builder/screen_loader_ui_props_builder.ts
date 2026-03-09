
import { reactive, Ref } from "vue";

import LoggerUtil from "../utils/logger_util";

import ContentManagerUtil from "../utils/content_manager_util";

import { 
    LoaderSymbolInterface,
    ScreenLoaderClassStylesInterface, 
    ScreenLoaderUIPropsInterface,
    ScreenLoaderUIContentPayloadInterface
} from "../ui_types/screen_loader_ui_type";



class ScreenLoaderUIPropsBuilder {
    private static readonly name = "screen_loader_ui_props_builder";
    private static readonly logger: LoggerUtil = new LoggerUtil({ prefix: ScreenLoaderUIPropsBuilder.name,  show_timestamp: false});
    private static readonly content_manager: ContentManagerUtil =  ContentManagerUtil.getInstance();

    // Method to build props object
    private static buildPropsObject(
        visible: boolean,
        loading_text?: string,
        content_data_key: string = "content_resource.screen_loader_ui",
        class_styles?: ScreenLoaderClassStylesInterface
    ): ScreenLoaderUIPropsInterface {
        const content_data = ScreenLoaderUIPropsBuilder.content_manager?.get<ScreenLoaderUIContentPayloadInterface>(content_data_key) ?? {};

        const { 
            img_src_link = "", 
            img_alt_text = "", 
            loader_text = "" 
        } = content_data;

        const loader_symbol: LoaderSymbolInterface = { 
            type: "img", 
            src: img_src_link ?? "", 
            class_style: class_styles?.loader_symbol_img_class_style, 
            alt_text: img_alt_text ?? ""
        }

        const _load_text = loading_text ?? loader_text ?? "";

        return {
            visible,
            loader_symbol,
            loader_text: _load_text,
            class_styles
        }
    }

    // Method to get reactive props object
    public static getReactivePropsObject (
        visible: boolean,
        class_styles?: ScreenLoaderClassStylesInterface,
        loading_text?: string,
        content_data_key: string = "content_resource.screen_loader_ui",
    ): ScreenLoaderUIPropsInterface {
        const props_obj = ScreenLoaderUIPropsBuilder.buildPropsObject(
            visible,
            loading_text,
            content_data_key,
            class_styles
        )
        return reactive<ScreenLoaderUIPropsInterface>(props_obj)
    }
}

export default ScreenLoaderUIPropsBuilder
import { reactive } from "vue";

import LoggerUtil from "../utils/logger_util";
import ContentManagerUtil from "../utils/content_manager_util";
import HeaderTextUiClassStyles from "../class_styles/header_text_class_styles";

import {
    HeaderTagType,
    HeaderTextUIClassStylesInterface,
    HeaderTextUIPropsInterface,
} from "../ui_types/header_text_ui_type";


class HeaderTextUIPropsBuilder {

    private static readonly name = "header_text_ui_props_builder";

    private static readonly logger: LoggerUtil =
        new LoggerUtil({ prefix: HeaderTextUIPropsBuilder.name, show_timestamp: false });

    private static readonly content_manager: ContentManagerUtil =
        ContentManagerUtil.getInstance();


    /* ---------------------------------- */
    /* Global Config                      */
    /* ---------------------------------- */

    public static class_styles?: HeaderTextUIClassStylesInterface;


    /* ---------------------------------- */
    /* Setup Method                       */
    /* ---------------------------------- */

    public static configure(
        class_styles: HeaderTextUIClassStylesInterface
    ): void {

        HeaderTextUIPropsBuilder.class_styles =
            class_styles || HeaderTextUiClassStyles;

    }


    /* ---------------------------------- */
    /* Build Props                        */
    /* ---------------------------------- */

    private static buildPropsObject(
        header_tag: HeaderTagType = "h2",
        content_data_key: string
    ): HeaderTextUIPropsInterface {

        const text_value =
            HeaderTextUIPropsBuilder.content_manager?.get<string>(content_data_key) ?? "";

        return {
            header_tag,
            text_value,
            class_styles: HeaderTextUIPropsBuilder.class_styles
        };

    }


    /* ---------------------------------- */
    /* Public Builder                     */
    /* ---------------------------------- */

    public static getReactivePropsObject(
        header_tag: HeaderTagType = "h2",
        content_data_key: string
    ): HeaderTextUIPropsInterface {

        const props_obj =
            HeaderTextUIPropsBuilder.buildPropsObject(
                header_tag,
                content_data_key
            );

        return reactive<HeaderTextUIPropsInterface>(props_obj);

    }

}

export default HeaderTextUIPropsBuilder;
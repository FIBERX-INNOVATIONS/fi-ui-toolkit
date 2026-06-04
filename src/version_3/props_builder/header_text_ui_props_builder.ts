import { reactive } from "vue";

import BasePropSchema from "../base_classes/base_prop_schema";
import ContentManagerUtil from "../utils/content_manager_util";
import HeaderTextUiClassStyles from "../class_styles/header_text_class_styles";

import {
    HeaderTagType,
    HeaderTextUIClassStylesInterface,
    HeaderTextUIPropsInterface
} from "../ui_types/header_text_ui_type";

class HeaderTextUIPropsBuilder extends BasePropSchema<HeaderTextUIPropsInterface> {
    public static readonly static_prop_keys = [
        "header_tag",
        "class_styles"
    ] satisfies readonly (keyof HeaderTextUIPropsInterface)[];

    private static readonly content_manager: ContentManagerUtil = ContentManagerUtil.getInstance();

    /* ---------------------------------- */
    /* Global Config                      */
    /* ---------------------------------- */

    public static class_styles?: HeaderTextUIClassStylesInterface;

    /* ---------------------------------- */
    /* Setup Method                       */
    /* ---------------------------------- */

    public static configure(class_styles: HeaderTextUIClassStylesInterface): void {
        HeaderTextUIPropsBuilder.class_styles = class_styles || HeaderTextUiClassStyles;
    }

    /* ---------------------------------- */
    /* Build Props                        */
    /* ---------------------------------- */

    private static buildPropsObject(
        header_tag: HeaderTagType = "h2",
        content_data_key: string,
        class_styles?: HeaderTextUIClassStylesInterface
    ): HeaderTextUIPropsInterface {
        const text_value = HeaderTextUIPropsBuilder.content_manager?.get<string>(content_data_key) ?? "";

        return {
            header_tag,
            text_value,
            class_styles: class_styles ?? HeaderTextUIPropsBuilder.class_styles
        };
    }

    /* ---------------------------------- */
    /* Public Builder                     */
    /* ---------------------------------- */

    public static getReactivePropsObject(
        header_tag: HeaderTagType = "h2",
        content_data_key: string,
        overides: Partial<HeaderTextUIPropsInterface> = {}
    ): HeaderTextUIPropsInterface {
        const props_obj = HeaderTextUIPropsBuilder.buildPropsObject(
            header_tag,
            content_data_key,
            overides.class_styles
        );

        return this.createReactiveProps<HeaderTextUIPropsInterface>(props_obj);
    }

    public static updateText(props: HeaderTextUIPropsInterface, text_value: string): HeaderTextUIPropsInterface {
        return this.updateProp(props, "text_value", text_value);
    }
}

export default HeaderTextUIPropsBuilder;

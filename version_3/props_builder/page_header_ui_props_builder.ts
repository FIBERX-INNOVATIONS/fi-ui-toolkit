import { reactive } from "vue";

import PageHeaderUIClassStyles from "../class_styles/page_header_ui_class_styles";

import {
    PageHeaderUIPropsInterface,
    PageHeaderUIClassStylesInterface
} from "../ui_types/page_header_ui_type";

import { HeaderTextUIPropsInterface } from "../ui_types/header_text_ui_type";
import { ButtonUIPropsInterface } from "../ui_types/button_ui_type";
import ContentManagerUtil from "../utils/content_manager_util";


class PageHeaderUIPropsBuilder {

    public static class_styles?: PageHeaderUIClassStylesInterface;


    public static configure(
        class_styles?: PageHeaderUIClassStylesInterface
    ): void {

        PageHeaderUIPropsBuilder.class_styles =
            class_styles || PageHeaderUIClassStyles;

    }


    private static buildPropsObject(

        header_props: HeaderTextUIPropsInterface,

        action_buttons: ButtonUIPropsInterface[] = [],

        description_text: string,

        overrides: Partial<PageHeaderUIPropsInterface> = {}

    ): PageHeaderUIPropsInterface {

        return {

            header_props,

            action_buttons,

            description_text: description_text ?? "",

            class_styles:
                overrides.class_styles ??
                PageHeaderUIPropsBuilder.class_styles ??
                PageHeaderUIClassStyles

        };

    }


    public static getReactivePropsObject(

        header_props: HeaderTextUIPropsInterface,

        action_buttons: ButtonUIPropsInterface[] = [],

        description_content_key: string,

        overrides: Partial<PageHeaderUIPropsInterface> = {}

    ): PageHeaderUIPropsInterface {

        const content_manager   = ContentManagerUtil.getInstance();
        const description_text  = content_manager.get<string>(description_content_key, "") ?? ""

        const props =
            PageHeaderUIPropsBuilder.buildPropsObject(
                header_props,
                action_buttons,
                description_text,
                overrides
            );

        return reactive<PageHeaderUIPropsInterface>(props);

    }

}

export default PageHeaderUIPropsBuilder;
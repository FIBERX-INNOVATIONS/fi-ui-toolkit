import { reactive } from "vue";

import LoggerUtil from "../utils/logger_util";
import ContentManagerUtil from "../utils/content_manager_util";

import InputGroupUIClassStyles from "../class_styles/input_group_ui_class_styles";

import {
    InputGroupUIPropsInterface,
    InputGroupUIClassStylesInterface
} from "../ui_types/input_group_ui_type";

import { InputUIContentPayloadInterface, InputUIPropsInterface } from "../ui_types/input_ui_type";


class InputGroupUIPropsBuilder {

    private static readonly name = "input_group_ui_props_builder";

    private static readonly logger =
        new LoggerUtil({
            prefix: InputGroupUIPropsBuilder.name,
            show_timestamp: false
        });

    private static readonly content_manager =
        ContentManagerUtil.getInstance();


    /* ---------------------------------- */
    /* Global Config                      */
    /* ---------------------------------- */

    public static class_styles?: InputGroupUIClassStylesInterface;


    /* ---------------------------------- */
    /* Setup                              */
    /* ---------------------------------- */

    public static configure(
        class_styles?: InputGroupUIClassStylesInterface
    ) {

        InputGroupUIPropsBuilder.class_styles =
            class_styles || InputGroupUIClassStyles;

    }

    /* ---------------------------------- */
    /* Content Fetch                      */
    /* ---------------------------------- */

    private static getContentProps(content_key?: string) {

        if (!content_key) return {};

        return (
            InputGroupUIPropsBuilder.content_manager
                ?.get<InputUIContentPayloadInterface>(content_key) ?? {}
        );

    }
    


    /* ---------------------------------- */
    /* Build Props                        */
    /* ---------------------------------- */

    private static buildPropsObject(

        input_props: InputUIPropsInterface,

        content_key?: string,

    ): InputGroupUIPropsInterface {
        const content_data =
            InputGroupUIPropsBuilder.getContentProps(content_key);


        return {

            id: input_props.id,

            label_text: content_data.label_text,

            helper_text: content_data.helper_text,

            show_required_text: (!!content_data.required_text),

            required_text: content_data?.required_text,

            input_props,

            class_styles:
                InputGroupUIPropsBuilder.class_styles ??
                InputGroupUIClassStyles

        };

    }


    /* ---------------------------------- */
    /* Public Builder                     */
    /* ---------------------------------- */

    public static getReactivePropsObject(

        input_props: InputUIPropsInterface,

        content_key?: string,
    ): InputGroupUIPropsInterface {

        const props =
            InputGroupUIPropsBuilder.buildPropsObject(input_props, content_key);

        return reactive<InputGroupUIPropsInterface>(props);

    }

}

export default InputGroupUIPropsBuilder;
import { reactive } from "vue";

import ContentManagerUtil from "../utils/content_manager_util";
import CopyRightUIClassStyles from "../class_styles/copy_right_ui_class_styles";

import {
    CopyRightUIClassStylesInterface,
    CopyRightUIPropsInterface,
    CopyRightUIContentPayloadInterface
} from "../ui_types/copy_rigth_ui_type";


class CopyRightUIPropsBuilder {

    private static readonly content_manager: ContentManagerUtil =
        ContentManagerUtil.getInstance();

    /* ---------------------------------- */
    /* Global Config                      */
    /* ---------------------------------- */

    public static class_styles?: CopyRightUIClassStylesInterface;


    /* ---------------------------------- */
    /* Setup Method                       */
    /* ---------------------------------- */

    public static configure(
        class_styles: CopyRightUIClassStylesInterface
    ): void {
        CopyRightUIPropsBuilder.class_styles  = class_styles || CopyRightUIClassStyles
    }

    /* ---------------------------------- */
    /* Build Props                        */
    /* ---------------------------------- */

    private static buildPropsObject(
        content_data_key: string = "content_resource.auth_layout_view_ui.footer",
    ): CopyRightUIPropsInterface {
        const content_data = CopyRightUIPropsBuilder.content_manager?.get<CopyRightUIContentPayloadInterface>(content_data_key) ?? {};

        const {
            powered_by_text = "",
            author_text = "",
            year_text
        } = content_data

        return {
            powered_by_text,
            author_text,
            year_text,
            class_styles: CopyRightUIPropsBuilder.class_styles
        }

    }

    /* ---------------------------------- */
    /* Public Builder                     */
    /* ---------------------------------- */

    public static getReactivePropsObject(
       content_data_key: string = "content_resource.auth_layout_view_ui.footer",
    ): CopyRightUIPropsInterface {

        const props_obj = CopyRightUIPropsBuilder.buildPropsObject(content_data_key);

        return reactive<CopyRightUIPropsInterface>(props_obj);
    }

}

export default CopyRightUIPropsBuilder;
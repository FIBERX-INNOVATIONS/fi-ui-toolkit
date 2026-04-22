import { reactive } from "vue";

import ContentManagerUtil from "../utils/content_manager_util";

import DataTableResultAndBulkActionBarUIClassStyles from "../class_styles/data_table_result_and_bulk_action_bar_ui_class_styles";

import {
    DataTableResultAndBulkActionBarUIPropsInterface,
    DataTableResultAndBulkActionBarUIClassStylesInterface,
    HeaderBarLayoutType,
    DataTableResultAndBulkActionBarUIContentPropsInterface,
    DataTableResultAndBulkActionBarUISelectionPropsInterface,
    DataTableResultAndBulkActionBarUIDataPropsInterface
} from "../ui_types/data_table_result_and_bulk_action_bar_ui_type";

import { ButtonUIPropsInterface } from "../ui_types/button_ui_type";


class DataTableResultAndBulkActionBarUIPropsBuilder {

    private static readonly content_manager =
        ContentManagerUtil.getInstance();

    /* ---------------------------------- */
    /* Global Config                      */
    /* ---------------------------------- */

    public static class_styles?: DataTableResultAndBulkActionBarUIClassStylesInterface;

    public static default_layout: HeaderBarLayoutType = "text-left";

    public static default_content_props?: DataTableResultAndBulkActionBarUIContentPropsInterface;

    public static default_selection_props?: DataTableResultAndBulkActionBarUISelectionPropsInterface;


    /* ---------------------------------- */
    /* Content Fetch                      */
    /* ---------------------------------- */

    private static getContentText(content_key?: string): string {

        if (!content_key) return "";

        return (
            DataTableResultAndBulkActionBarUIPropsBuilder.content_manager?.get<string>(content_key) ?? ""
        );

    }


    /* ---------------------------------- */
    /* Configure                          */
    /* ---------------------------------- */

    public static configure(params: {
        class_styles?: DataTableResultAndBulkActionBarUIClassStylesInterface,
        layout?: HeaderBarLayoutType,
        content_props?: DataTableResultAndBulkActionBarUIContentPropsInterface,
        selection_props?: DataTableResultAndBulkActionBarUISelectionPropsInterface
    }): void {
        const {
            class_styles,
            layout = "text-left",
            content_props,
            selection_props
        } = params

        DataTableResultAndBulkActionBarUIPropsBuilder.class_styles =
            class_styles || DataTableResultAndBulkActionBarUIClassStyles;

        DataTableResultAndBulkActionBarUIPropsBuilder.default_layout =
            layout;

        DataTableResultAndBulkActionBarUIPropsBuilder.default_content_props =
            content_props || {};

        DataTableResultAndBulkActionBarUIPropsBuilder.default_selection_props =
            selection_props || {};

    }


    /* ---------------------------------- */
    /* Build Props Object                 */
    /* ---------------------------------- */

    private static buildPropsObject(

        id: string,

        data_props: DataTableResultAndBulkActionBarUIDataPropsInterface,

        overrides: Partial<DataTableResultAndBulkActionBarUIPropsInterface> = {}

    ): DataTableResultAndBulkActionBarUIPropsInterface {

        const class_styles =
            overrides.class_styles ??
            DataTableResultAndBulkActionBarUIPropsBuilder.class_styles ??
            DataTableResultAndBulkActionBarUIClassStyles;

        /* ---------- Content ---------- */

        const header_text_key =
            overrides.content_props?.header_text_key ??
            DataTableResultAndBulkActionBarUIPropsBuilder.default_content_props?.header_text_key;

        const header_text =
            DataTableResultAndBulkActionBarUIPropsBuilder.getContentText(header_text_key);

        const content_props: DataTableResultAndBulkActionBarUIContentPropsInterface = {
            header_text_key: header_text_key
        };

        /* ---------- Selection ---------- */

        const selection_props: DataTableResultAndBulkActionBarUISelectionPropsInterface = {

            ...DataTableResultAndBulkActionBarUIPropsBuilder.default_selection_props,

            ...overrides.selection_props

        };

        /* ---------- Final Props ---------- */

        return {

            id,

            layout:
                overrides.layout ??
                DataTableResultAndBulkActionBarUIPropsBuilder.default_layout,

            content_props,

            data_props,

            selection_props,

            class_styles

        };

    }


    /* ---------------------------------- */
    /* Public Builder                     */
    /* ---------------------------------- */

    public static getReactivePropsObject(

        id: string,

        total_records: number,

        filtered_records: number,

        current_page: number,

        total_pages: number,

        show_bulk_button: boolean = false,

        selected_records_count: number = 0,

        overrides: Partial<DataTableResultAndBulkActionBarUIPropsInterface> = {}

    ): DataTableResultAndBulkActionBarUIPropsInterface {

        const data_props: DataTableResultAndBulkActionBarUIDataPropsInterface = {
            total_records,
            filtered_records,
            current_page,
            total_pages,
        }

        const selection_props: DataTableResultAndBulkActionBarUISelectionPropsInterface = {
            show_bulk_button,
            selected_count: selected_records_count,
            ...overrides.selection_props
        };

        overrides.selection_props = selection_props;

        const props =
            DataTableResultAndBulkActionBarUIPropsBuilder.buildPropsObject(
                id,
                data_props,
                overrides
            );

        return reactive<DataTableResultAndBulkActionBarUIPropsInterface>(props);

    }

}

export default DataTableResultAndBulkActionBarUIPropsBuilder;
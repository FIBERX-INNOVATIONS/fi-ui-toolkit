import { PropType } from "vue";

import {
    DataTableResultAndBulkActionBarUIPropsInterface,
    HeaderBarLayoutType,
    DataTableResultAndBulkActionBarUIContentPropsInterface,
    DataTableResultAndBulkActionBarUIDataPropsInterface,
    DataTableResultAndBulkActionBarUISelectionPropsInterface,
    DataTableResultAndBulkActionBarUIClassStylesInterface
} from "../ui_types/data_table_result_and_bulk_action_bar_ui_type";

import DataTableResultAndBulkActionBarUIClassStyles from "../class_styles/data_table_result_and_bulk_action_bar_ui_class_styles";

const DataTableResultAndBulkActionBarUIUIProps = {

    id: {
        type: String,
        required: false
    },

    layout: {
        type: String as PropType<HeaderBarLayoutType>,
        default: "text-left"
    },

    content_props: {
        type: Object as PropType<DataTableResultAndBulkActionBarUIContentPropsInterface>,
        default: () => ({})
    },

    data_props: {
        type: Object as PropType<DataTableResultAndBulkActionBarUIDataPropsInterface>,
        required: true,
        default: () => ({ total_records: 0, filtered_records: 0, current_page: 0, total_pages: 0 })
    },

    selection_props: {
        type: Object as PropType<DataTableResultAndBulkActionBarUISelectionPropsInterface>,
        default: () => ({})
    },

    class_styles: {
        type: Object as PropType<DataTableResultAndBulkActionBarUIClassStylesInterface>,
        default: () => DataTableResultAndBulkActionBarUIClassStyles
    }

} satisfies Record<keyof DataTableResultAndBulkActionBarUIPropsInterface, any>;

export default DataTableResultAndBulkActionBarUIUIProps;
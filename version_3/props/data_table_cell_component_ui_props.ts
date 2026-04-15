import { PropType } from "vue";

import {
    DataTableCellComponentUIPropsInterface,
} from "../ui_types/data_table_cell_component_ui_type";

import { 
    DataTableColumnRenderType,
} from "../ui_types/data_table_ui_type";

const DataTableCellComponentUIProps = {

    record: {
        type: Object as PropType<any>,
        required: false
    },

    column: {
        type: Object as PropType<DataTableColumnRenderType>,
        required: true
    },

    record_index: {
        type: Number,
        required: false
    }

} satisfies Record<keyof DataTableCellComponentUIPropsInterface, any>;

export default DataTableCellComponentUIProps;
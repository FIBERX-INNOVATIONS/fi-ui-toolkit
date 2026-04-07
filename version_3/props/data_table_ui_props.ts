import { PropType } from "vue";

import DataTableUIClassStyles from "../class_styles/data_table_ui_class_styles";

import { 
    DataTableColumnRenderType,
    DataTableUIPropsInterface,
    DataTableUIActionPropsInterface,
    DataTableUIClassStylesInterface,
    DataTableUIContentPropsInterface
} from "@ui_v3/ui_types/data_table_ui_type";

export const DataTableUIProps = {
    section_id: {
        type: String,
        required: false
    },

    table_id: {
        type: String,
        required: false
    },

    is_loading: {
        type: Boolean,
        default: () => (false),
        required: false
    },

    content: {
        type: Object as PropType<DataTableUIContentPropsInterface>,
        default: () => ({})
    },

    data: {
        type: Array as PropType<any[]>,
        default: () => []
    },

    row_key: {
        type: String,
        default: "id"
    },

    table_render_obj: {
        type: Array as PropType<DataTableColumnRenderType[]>,
        default: () => []
    },

    action_props: {
        type: Object as PropType<DataTableUIActionPropsInterface>,
        default: () => ({})
    },
    

    class_styles: {
        type: Object as PropType<DataTableUIClassStylesInterface>,
        default: () => DataTableUIClassStyles
    }

} satisfies Record<keyof DataTableUIPropsInterface, any>;
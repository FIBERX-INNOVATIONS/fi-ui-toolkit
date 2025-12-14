import { PropType }                 from "vue";
import { ClassStyles }              from "./table_body_ui_class_styles"
import { TableColumnInterface }     from "../../../types/props_builder_type";

const TableBodyUIProps = {
    records: { type: Array as PropType<Record<string, any>[]>, default: [], required: true },
    
    columns: { type: Array as PropType<TableColumnInterface[]>, default: [], required: true },
    
    sn_text: { type: String, default: "#" },
    
    actions_text: { type: String, default: "Actions" },

    empty_text: { type: String, default: "No records found." },
    
    wrapper_class_style: { type: String, default: ClassStyles?.wrapper_class_style },

    body_row_class_style: { type: String, default: ClassStyles?.body_row_class_style },

    body_cell_class_style: { type: String, default: ClassStyles?.body_cell_class_style },

    selected_checkbox_class_style: { type: String, default: ClassStyles?.selected_checkbox_class_style },

    selected_records: { type: Array as PropType<(string | number | Record<string, any>)[]>, default: () => [] },
    
    record_id_key: { type: String, default: "id" },
    
    on_row_select: { 
        type: Function as PropType<(event: Event | InputEvent, record: Record<string, any>, checked: boolean) => void>,
        default: null,
    },
}

export default TableBodyUIProps;


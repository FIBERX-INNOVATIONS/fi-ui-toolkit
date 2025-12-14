import { PropType }                 from "vue";
import { ClassStyles }              from "./table_header_ui_class_styles";
import { TableColumnInterface }     from "../../../types/props_builder_type";


const TableHeaderUIProps = {
    columns: { type: Array as PropType<TableColumnInterface[]>, required: true },
    
    sn_text: { type: String, default: "#" },
    
    actions_text: { type: String, default: "Actions" },
    
    wrapper_class_style: { type: String, default: ClassStyles?.wrapper_class_style },

    header_row_class_style: { type: String, default: ClassStyles?.header_row_class_style },

    header_cell_class_style: { type: String, default: ClassStyles?.header_cell_class_style },

    selected_checkbox_class_style: { type: String, default: ClassStyles?.selected_checkbox_class_style },

    all_selected: { type: Boolean, default: false },
    
    some_selected: { type: Boolean, default: false },

    on_toggle_all: { type: Function as PropType<(event: Event | InputEvent, checked: boolean) => void>, default: null },
}

export default TableHeaderUIProps;


import { PropType }                 from "vue";
import { ClassStyles }              from "./data_table_ui_class_styles";

import { 
    TableHeaderUIPropsInterface,
    TableBodyUIPropsInterface
} from "../../../types/props_builder_type";


const DataTableUIProps = {
    table_id: { type: String, required: false },

    is_loading: { type: Boolean, default: true, required: false },

    number_of_loading_bars: { type: Number, default: 12, required: false },

    header_props: { type: Object as PropType<TableHeaderUIPropsInterface>, required: true },

    body_props: { type: Object as PropType<TableBodyUIPropsInterface>, required: true },

    wrapper_class_style: { type: String, default: ClassStyles?.wrapper_class_style, required: false },

    table_class_style: { type: String, default: ClassStyles?.table_class_style, required: false },

    lg_table_wrapper_class_style: { type: String, default: ClassStyles?.lg_table_wrapper_class_style, required: false },
};

export default DataTableUIProps;

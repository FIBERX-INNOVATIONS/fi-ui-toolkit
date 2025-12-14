
import { PropType }                 from "vue";
import { ClassStyles }              from "./sortable_header_cell_ui_class_styles";
import { SortDirectionType }        from "../../../types/props_builder_type";


const SortableHeaderCellUIProps = {
    id: { type: String, required: false },

    label_content: { type: String, required: true },

    field_key: { type: String, required: true },

    sortable: { type: Boolean, default: false },

    sort_direction: { type: String as PropType<SortDirectionType>, default: "none" },

    on_sort: { type: Function as PropType<(event:MouseEvent, dir: SortDirectionType) => void>, default: null },

    wrapper_class_style: { type: String, default: ClassStyles?.wrapper_class_style },

    content_wrapper_class_style: { type: String, default: ClassStyles?.content_wrapper_class_style },

    icon_class_style: { type: String, default: ClassStyles?.icon_class_style },
 
}

export default SortableHeaderCellUIProps;
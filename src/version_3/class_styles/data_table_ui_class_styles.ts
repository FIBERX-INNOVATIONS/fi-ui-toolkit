import { DataTableUIClassStylesInterface } from "../ui_types/data_table_ui_type";

const DataTableUIClassStyles: DataTableUIClassStylesInterface = {
    wrapper_class_style: "w-full overflow-x-auto",
    table_class_style: "w-full border-collapse text-sm",

    thead_class_style: "bg-gray-100 sticky top-0",
    th_class_style:
        "text-left px-4 py-3 font-semibold text-gray-700 cursor-pointer select-none hover:bg-gray-200 transition-colors",
    th_cell_wrapper_class_style: "flex items-center gap-2",
    th_sort_icon_class_style: "ml-1 inline-block text-xs",

    tbody_class_style: "divide-y divide-gray-200",
    tr_class_style: "border-b hover:bg-gray-50 transition-colors",
    td_class_style: "px-4 py-3 text-gray-800",

    sortable_header_wrapper_class_style: "flex items-center justify-between gap-2",
    sortable_header_icon_class_style: "text-xs opacity-60",

    loading_section_wrapper_class_style: "flex items-center justify-center py-8",
    loader_text_wrapper_class_style: "flex flex-col items-center justify-center gap-3",
    loader_text_icon_class_style: "animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full",
    loader_skeleton_bar_class_style: "w-full h-10 my-2 bg-gray-300 rounded animate-pulse",
    empty_data_wrapper_class_style: "flex items-center justify-center py-12 text-center",
    empty_data_class_style: "text-gray-500 text-sm"
};

export default DataTableUIClassStyles;

import { DataTableUIClassStylesInterface } from "../ui_types/data_table_ui_type";

const DataTableUIClassStyles: DataTableUIClassStylesInterface = {
    wrapper_class_style: "w-full",
    table_class_style: "w-full border-collapse",

    thead_class_style: "bg-gray-100",
    th_class_style: "text-left px-4 py-2 cursor-pointer select-none",
    th_cell_wrapper_class_style: "",
    th_sort_icon_class_style: "ml-2 inline-block",

    tbody_class_style: "",
    tr_class_style: "border-b hover:bg-gray-50",
    td_class_style: "px-4 py-2",

    sortable_header_wrapper_class_style: "flex flex-col ml-1",
    sortable_header_icon_class_style: "",

    loading_section_wrapper_class_style: "text-center py-6",
    loader_text_wrapper_class_style: "flex justify-center items-center gap-2",
    loader_text_icon_class_style: "animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full",
    loader_skeleton_bar_class_style: "w-full h-12 my-4 bg-gray-300 rounded-lg shadow",
    empty_data_wrapper_class_style: "text-center py-6 opacity-70",
    empty_data_class_style: "",
};

export default DataTableUIClassStyles;
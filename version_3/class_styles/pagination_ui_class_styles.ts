import { PaginationUIClassStylesInterface } from "../ui_types/pagination_ui_type";

const PaginationUIClassStyles: PaginationUIClassStylesInterface = {

    wrapper_class_style:
        "flex items-center justify-center gap-2",

    button_class_style:
        "px-3 py-1 border rounded",

    active_page_class_style:
        "bg-blue-500 text-white",

    disabled_class_style:
        "opacity-50 cursor-not-allowed",

    page_container_class_style:
        "flex items-center gap-1"

};

export default PaginationUIClassStyles;
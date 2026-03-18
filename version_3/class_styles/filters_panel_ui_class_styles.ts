import { FiltersPanelUIClassStylesInterface } from "../ui_types/filters_panel_ui_type";

const FiltersPanelUIClassStyles: FiltersPanelUIClassStylesInterface = {

    wrapper_class_style:
        "w-full flex flex-col gap-3",

    toggle_btn_wrapper_class_style:
        "flex items-center",

    toggle_btn_icon_class_style: "",

    toggle_btn_content_wrapper_class_style: "",

    toggle_btn_class_style: "",

    panel_wrapper_class_style:
        "overflow-hidden transition-all duration-300",

    filters_grid_class_style:
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",

    actions_wrapper_class_style:
        "flex flex-wrap gap-3 pt-2"

};

export default FiltersPanelUIClassStyles;
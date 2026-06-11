import { TabsUIClassStylesInterface } from "../ui_types/tabs_ui_type";

const TabsUIClassStyles: TabsUIClassStylesInterface = {
    wrapper_class_style: "flex w-full flex-col gap-4",

    tabs_list_class_style: "flex flex-wrap gap-2 border-b border-gray-200",

    tab_button_class_style:
        "inline-flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors duration-200",

    active_tab_button_class_style: "border-gray-950 text-gray-950",

    inactive_tab_button_class_style: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-800",

    disabled_tab_button_class_style: "cursor-not-allowed opacity-50 hover:border-transparent hover:text-gray-500",

    tab_icon_class_style: "h-4 w-4 shrink-0",

    tab_label_class_style: "truncate",

    panel_wrapper_class_style: "w-full",

    panel_class_style: "w-full",

    error_class_style: "text-sm leading-5 text-red-600"
};

export default TabsUIClassStyles;

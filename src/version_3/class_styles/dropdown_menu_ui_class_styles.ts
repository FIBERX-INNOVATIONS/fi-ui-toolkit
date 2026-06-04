import { DropdownMenuUIClassStylesInterface } from "../ui_types/dropdown_menu_ui_type";

const DropdownMenuUIClassStyles: DropdownMenuUIClassStylesInterface = {
    wrapper_class_style: "fixed z-50",

    menu_class_style: "bg-white shadow-lg rounded-md py-2 min-w-[200px]",

    menu_item_wrapper_class_style: "px-3 py-2",

    menu_item_has_children_wrapper_class_style: "flex items-center justify-between gap-2",

    caret_button_class_style: "inline-flex items-center justify-center p-1 text-gray-500 hover:text-gray-700",

    caret_icon_class_style: "w-4 h-4 transition-transform duration-200",

    children_wrapper_class_style: "pl-4 border-l border-gray-200 mt-2",

    visible_class_style: "block"
};

export default DropdownMenuUIClassStyles;

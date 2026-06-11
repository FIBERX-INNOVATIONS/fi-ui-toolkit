import { ContentCardUIClassStylesInterface } from "../ui_types/content_card_ui_type";

const ContentCardUIClassStyles: ContentCardUIClassStylesInterface = {
    wrapper_class_style: "overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm",

    header_class_style: "border-b border-gray-100 px-5 py-4",

    title_class_style: "flex items-center gap-2 text-base font-semibold leading-6 text-gray-950",

    title_icon_class_style: "h-5 w-5 shrink-0 text-gray-600",

    title_text_class_style: "min-w-0 truncate",

    media_wrapper_class_style: "bg-gray-50",

    media_class_style: "block h-48 w-full object-cover",

    media_description_class_style: "px-5 pt-3 text-xs leading-5 text-gray-500",

    body_class_style: "space-y-4 px-5 py-4",

    description_class_style: "text-sm leading-6 text-gray-700",

    actions_class_style: "pt-1",

    button_class_style:
        "inline-flex items-center justify-center gap-2 rounded-md bg-gray-950 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-gray-800",

    button_disabled_class_style: "cursor-not-allowed opacity-60 hover:bg-gray-950",

    button_loading_class_style: "opacity-80",

    button_icon_class_style: "h-4 w-4 shrink-0",

    button_text_class_style: "truncate",

    error_class_style: "text-sm leading-5 text-red-600"
};

export default ContentCardUIClassStyles;

import { DecisionPromptUIClassStylesInterface } from "../ui_types/decision_prompt_ui_type";

const DecisionPromptUIClassStyles: DecisionPromptUIClassStylesInterface = {
    wrapper_class_style: "flex flex-col gap-6 p-6 max-w-md bg-white rounded-lg shadow-lg",

    content_wrapper_class_style: "flex flex-col gap-3",

    title_class_style: "text-lg font-bold text-gray-900",

    message_class_style: "text-sm text-gray-600 leading-relaxed",

    reason_wrapper_class_style: "flex flex-col gap-2",

    reason_label_class_style: "text-sm font-medium text-gray-800",

    reason_input_class_style:
        "min-h-24 w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:cursor-not-allowed disabled:bg-gray-100",

    reason_helper_class_style: "text-xs leading-5 text-gray-500",

    actions_wrapper_class_style: "flex gap-3 justify-end pt-4 border-t border-gray-200"
};

export default DecisionPromptUIClassStyles;

import { DecisionPromptUIClassStylesInterface } from "../ui_types/decision_prompt_ui_type";

const DecisionPromptUIClassStyles: DecisionPromptUIClassStylesInterface = {
    wrapper_class_style: "flex flex-col gap-6 p-6 max-w-md bg-white rounded-lg shadow-lg",

    content_wrapper_class_style: "flex flex-col gap-3",

    title_class_style: "text-lg font-bold text-gray-900",

    message_class_style: "text-sm text-gray-600 leading-relaxed",

    actions_wrapper_class_style: "flex gap-3 justify-end pt-4 border-t border-gray-200"
};

export default DecisionPromptUIClassStyles;

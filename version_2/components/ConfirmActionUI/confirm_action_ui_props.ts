import { PropType }                 from "vue";
import { ClassStyles }              from "./confirm_action_ui_class_styles";

const ConfirmActionUIProps   = {

    question_text: { type: String, default: "", required: true },

    cancel_btn_content: { type: String, default: "Cancel", required: false },

    confirm_btn_content: { type: String, default: "Confirm", required: false },

    wrapper_class_style: { type: String, default: ClassStyles?.wrapper_class_style, required: false },

    content_text_wrapper_class_style: { type: String, default: ClassStyles?.content_text_wrapper_class_style, required: false },

    content_class_style: { type: String, default: ClassStyles?.content_class_style, required: false },

    action_btn_wrapper_class_style: { type: String, default: ClassStyles?.action_btn_wrapper_class_style, required: false },

    on_cancel_click:  { type: Function, default: null, required: false },

    on_confirm_click:  { type: Function, default: null, required: false },
}

export default ConfirmActionUIProps;
import { PropType }                 from "vue";
import { ClassStyles }              from "./masked_reveal_ui_class_styles";
import SVGIcons                     from "../../resources/svg_icon_resource";

const MaskedRevealUIProps  = {

    secret_data: { type: String, default: "", required: true },

    reveal_duration_in_seconds: { type: Number, default: 5, required: true },

    wrapper_class_style: { type: String, default: ClassStyles?.wrapper_class_style, required: false },

    secret_data_input_wrapper_class_style: { type: String, default: ClassStyles?.secret_data_input_wrapper_class_style, required: false },

    secret_data_input_class_style: { type: String, default: ClassStyles?.secret_data_input_class_style, required: false },

    action_btn_wrapper_class_style: { type: String, default: ClassStyles?.action_btn_wrapper_class_style, required: false },

    reveal_btn_class_style: { type: String, default: ClassStyles?.reveal_btn_class_style, required: false },

    reveal_btn_text_class_style: { type: String, default: ClassStyles?.reveal_btn_text_class_style, required: false },

    reveal_btn_icon_class_style: { type: String, default: ClassStyles?.reveal_btn_icon_class_style, required: false },

    copy_btn_class_style: { type: String, default: ClassStyles?.copy_btn_class_style, required: false },

    copy_btn_text_class_style: { type: String, default: ClassStyles?.copy_btn_text_class_style, required: false },

    copy_btn_icon_class_style: { type: String, default: ClassStyles?.copy_btn_icon_class_style, required: false },

    reveal_btn_text: { type: String, default: "Reveal", required: false },

    hide_btn_text: { type: String, default: "Hide", required: false },

    copy_btn_text: { type: String, default: "Copy", required: false },

    copied_btn_text: { type: String, default: "Copied", required: false },

    reveal_svg_btn_icon: { type: String, default: SVGIcons.view_eye_svg_icon, required: false },

    hide_svg_btn_icon: { type: String, default: SVGIcons.hidden_eye_slash_svg_icon, required: false },

    copy_svg_btn_icon: { type: String, default: SVGIcons.document_copy_svg_icon, required: false },

    copied_svg_btn_icon: { type: String, default: SVGIcons.check_circle_svg_icon, required: false },

    on_toggle_reveal_click:  { type: Function, default: null, required: false },

    on_copy_click:  { type: Function, default: null, required: false },
}

export default MaskedRevealUIProps;
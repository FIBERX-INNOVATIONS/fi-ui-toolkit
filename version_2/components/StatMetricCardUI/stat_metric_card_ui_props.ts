import { PropType }         from "vue";
import { ClassStyles }      from "./stat_metric_card_ui_class_styles";
import { PropRenderContentFnType } from "../../types/component_type";


const StatMetricCardUIProps = {
    /** Data */
    metric_value: { type: [String, Number], default: "", required: false },

    metric_suffix: { type: String, default: "", required: false },

    /* 🔹 secondary metric (optional) */
    metric_value_2: { type: [String, Number], default: null },

    metric_suffix_2: { type: String, default: "" },

    /* divider */
    metric_divider: { type: String, default: "/" },

    /* class styles */
    metric_divider_class_style: {
        type: String,
        default: ClassStyles.metric_divider_class_style,
    },

    /** Render functions */
    renderTopContent: {
        type: Function as PropType<PropRenderContentFnType>,
        default: () => "",
        required: false
    },

    renderBottomContent: {
        type: Function as PropType<PropRenderContentFnType>,
        default: () => "",
        required: false
    },

    /** Optional link */
    top_link_text: { type: String, default: "", required: false },

    onTopLinkClick: {
        type: Function as PropType<(event: MouseEvent) => void>,
        default: null,
        required: false
    },

    /** Class styles */
    wrapper_class_style: { type: String, default: ClassStyles?.wrapper_class_style },

    top_section_class_style: { type: String, default: ClassStyles?.top_section_class_style },

    middle_section_class_style: { type: String, default: ClassStyles?.middle_section_class_style },

    metric_value_class_style: { type: String, default: ClassStyles?.metric_value_class_style },

    metric_suffix_class_style: { type: String, default: ClassStyles?.metric_suffix_class_style },

    bottom_section_class_style: { type: String, default: ClassStyles?.bottom_section_class_style },

    metic_one_wrapper_class_style: { type: String, default: ClassStyles?.metic_one_wrapper_class_style },

    metic_two_wrapper_class_style: { type: String, default: ClassStyles?.metic_two_wrapper_class_style },
};

export default StatMetricCardUIProps;

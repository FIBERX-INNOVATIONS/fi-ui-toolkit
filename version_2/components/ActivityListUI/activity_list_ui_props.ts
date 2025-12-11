
import { PropType }                 from "vue";
import { ComponentClassStyles }     from "../../enums/component_class_styles.enums";
import { PropRenderFnType }         from "../../types/component_type";
import InputTransformerUtil         from "../../utils/input_formatter_util";

const ui_class_styles       = ComponentClassStyles.activity_list_ui;

const ActivityListUIProps   = {
    select_mode: { type: Boolean, default: false },

    selected_records: { type: Array as PropType<string[] | number[]>, default: () => [] },

    activity_records: { type: Array as PropType<Record<string, any>[]>,  default: () => [],  required: false },

    getRecordId: {
        type: Function as PropType<(record: Record<string, any>) => string | number>,
        default: (record: Record<string, any>) => { return (record.id ?? JSON.stringify(record)) },
        required: false
    },

    onSelect: {
        type: Function as PropType<(event: Event | InputEvent, record: Record<string, any>, checked: boolean) => void>,
        default: null
    },

    renderHeaderSection1Content: { 
        type: Function as PropType<PropRenderFnType>, 
        default: (index: number) => String(index + 1),
        required: false 
    },

    renderHeaderSection2Content: { 
        type: Function as PropType<PropRenderFnType>, 
        default: (_i: number, record: Record<string, any>) => { return (InputTransformerUtil.formatReadableDateTime(record?.created_at ?? "")) },
        required: false 
    },

    renderBodyContent: { 
        type: Function as PropType<PropRenderFnType>, 
        default: (_i: number, record: Record<string, any>) => { return (record?.description ?? "") },
        required: false 
    },

    loader_content_text: { type: String, default: "", required: false },

    wrapper_class_style: { type: String, default: ui_class_styles.wrapper_class_style, required: false },

    activity_wrapper_class_style: { type: String, default: ui_class_styles.activity_wrapper_class_style, required: false },

    activity_header_class_style: { type: String, default: ui_class_styles.activity_header_class_style, required: false },

    activity_header_section_1_class_style: { type: String, default: ui_class_styles.activity_header_section_1_class_style, required: false },

    activity_header_section_2_class_style: { type: String, default: ui_class_styles.activity_header_section_2_class_style, required: false },

    activity_body_class_style: { type: String, default: ui_class_styles.activity_body_class_style, required: false },

    activtiy_body_content_class_style: { type: String, default: ui_class_styles.activtiy_body_content_class_style, required: false },

    select_checkbox_wrapper_class_style: { type: String, default: ui_class_styles.select_checkbox_wrapper_class_style, required: false },

    select_checkbox_class_style: { type: String, default: ui_class_styles.select_checkbox_class_style, required: false },
}

export default ActivityListUIProps;
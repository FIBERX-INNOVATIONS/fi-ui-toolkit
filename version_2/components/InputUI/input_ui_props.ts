import { PropType }                 from "vue";
import { ClassStyles }              from "./input_ui_class_styles";


const InputUIProps   = {
    id: { type: String, required: true },

    switch_btn_id: { type: String, required: false },

    type: { type: String, required: true },

    placeholder: { type: String, default: "", required: false },

    loader_content: { type: String, default: "", required: false }, 

    caret_content: { type: String, default: "", required: false }, 

    no_options_content: { type: String, default: "No results found", required: false }, 

    label_text: { type: String, default: "", required: false }, 

    is_loading: { type: Boolean, default: false, required: false },
            
    read_only: { type: Boolean, default: false, required: false },
    
    is_checked: { type: Boolean, default: false, required: false },

    value: { type: [String, Array, Boolean, Number], default: "", required: false },

    checkbox_value: { type: [String, Array, Boolean, Number], default: "", required: false },

    options: { type: Array as PropType<Array<{ value: string | number; label_text: string }>>, default: () => [], required: false },

    required: { type: Boolean, default: false, required: false },

    cache_enabled: { type: Boolean, default: true, required: false },

    length: { type: Number, default: 6, required: false },

    rows: { type: Number, default: 4, required: false },

    min: { type: Number, default: 0, required: false },

    max: { type: Number, default: 100, required: false },

    on_key_up:  { type: Function, default: null, required: false },

    on_key_down:  { type: Function, default: null, required: false },
    
    on_change:  { type: Function, default: null, required: false },

    on_click:  { type: Function, default: null, required: false },

    render_option_label:  { type: Function, default: null, required: false },

    get_option_value:  { type: Function, default: null, required: false },

    fetch_method: { type: Function, default: null, required: false },

    additional_parms: { type: Object, default: () => { return {}}, required: false },
    
    input_class_style: { type: String, default: ClassStyles?.input_class_style, required: false },

    wrapper_class_style: { type: String, default: ClassStyles?.wrapper_class_style, required: false },

    loader_class_style: { type: String, default: ClassStyles?.loader_class_style, required: false },

    switch_btn_class_style: { type: String, default: ClassStyles?.switch_btn_class_style, required: false },

    label_text_class_style: { type: String, default: ClassStyles?.label_text_class_style, required: false }, 

    knob_class_style: { type: String, default: ClassStyles?.knob_class_style, required: false }, 

    active_class_style: { type: String, default: ClassStyles?.active_class_style, required: false }, 

    inactive_class_style: { type: String, default: ClassStyles?.inactive_class_style, required: false }, 

    caret_icon_class: { type: String, default: ClassStyles?.caret_icon_class, required: false }, 

    dropdown_wrapper_class_style: { type: String, default: ClassStyles?.dropdown_wrapper_class_style, required: false }, 

    options_wrapper_class_style: { type: String, default: ClassStyles?.options_wrapper_class_style, required: false }, 

    option_class_style: { type: String, default: ClassStyles?.option_class_style, required: false }, 

    option_content_class_style: { type: String, default: ClassStyles?.option_content_class_style, required: false }, 

    
}

export default InputUIProps;


import { SVGIconKey } from "../resources/svg_icon_resource";

import { Component, Ref } from "vue";

export interface InputUIContentOptionsInterface {
    loader_html_content?: string;

    caret_html_contewnt?: string;

    no_options_html_content?: string;

    search_icon_html_content?: string;

    seperator_icon_html?: SVGIconKey
}

export interface InputUIBooleanPropsInterface {
    read_only?: boolean;

    is_checked?: boolean;

    is_loading?: boolean;

    cache_enabled?: boolean;

    required?: boolean;

    disabled?: boolean;
}

export interface InputUINumberPropsInterface {
    min?: number;

    max?: number;

    length?: number;

    rows?: number;

    step?: number
}

export interface ActionMethodRetrunInterface {
    status: boolean;
    msg: string;
    data?: Record<string, any>;
}

export interface InputUIActionPropsInterface {
    on_key_up?: (
        event?: KeyboardEvent, 
        input_value?: InputValue,
        input_config?: { props: InputUIPropsInterface }
    ) => Promise<ActionMethodRetrunInterface>;

    on_key_down?: (
        event?: KeyboardEvent,
        input_value?: InputValue,
        input_config?: { props: InputUIPropsInterface }
    ) => Promise<ActionMethodRetrunInterface>;

    on_change?: (
        event?: Event,
        input_value?: InputValue,
        input_config?: { props: InputUIPropsInterface }
    ) => Promise<ActionMethodRetrunInterface>;

    on_click?: (
        event?: MouseEvent,
        input_value?: InputValue,
        input_config?: { props: InputUIPropsInterface }
    ) => Promise<ActionMethodRetrunInterface>;

    set_error_text?: (error_text: string) => void;

    render_option_label?: (option: SelectOptionInterface) => string;

    get_option_value?: (option: SelectOptionInterface) => string | number;

    fetch_data_method?: (
        params: { page: number; search: string | null }
    ) => Promise<{ records: SelectOptionInterface[], total_pages: number }>;

}

export interface InputUIFilePropsInterface {   
    accept?: string;
    
    multiple?: boolean;

    enable_preview?: boolean;

    preview_type?: "image" | "file";

    generic_file_preview_icon?: SVGIconKey;

    generic_file_preview_content?: string;
}

export interface PhoneNumberCountryInfoInterface {
  name: string;
  iso2: string;
  dialCode: string;
  priority: number;
  areaCodes: string[] | null;
}

export interface PhoneNumberResultInterface {
  countryCallingCode: string;
  nationalNumber: string;
  number: string;
  country: PhoneNumberCountryInfoInterface;
  countryCode: string;
  valid: boolean;
  formatted: string;
}

export interface InputDateRangeValueType { start_date: string, end_date: string };

/* ---------------------------------- */
/* Input Type                         */
/* ---------------------------------- */
export type InputValue = 
    | string 
    | number 
    | boolean 
    | Array<any> 
    | File
    | File[]
    | null 
    | InputDateRangeValueType


export type InputType =
    | "text"
    | "textarea"
    | "number"
    | "checkbox"
    | "switch"
    | "select"
    | "select_search"
    | "phone_number"
    | "otp"
    | "file"
    | "password"
    | "search"
    | "date"
    | "date_range";


/* ---------------------------------- */
/* Select Option                      */
/* ---------------------------------- */

export interface SelectOptionInterface {
    label_text: string;
    value: string | number;
}


/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

export interface InputUIClassStylesInterface {
    input_class_style: string;

    wrapper_class_style: string;

    otp_wrapper_class_style?: string;

    loader_class_style?: string;

    switch_btn_class_style?: string;

    knob_class_style?: string;

    label_text_class_style?: string;

    active_class_style?: string;

    inactive_class_style?: string;

    caret_icon_class?: string;

    dropdown_wrapper_class_style?: string;

    options_wrapper_class_style?: string;

    option_class_style?: string;

    option_content_class_style?: string;

    input_readonly_class_style?: string;

    helper_text_class_style?: string;

    error_text_class_style?: string;

    search_wrapper_class_style?: string;

    search_icon_class_style?: string;

    search_input_class_style?: string;

    range_container_class_style?: string;

    range_separator_class_style?: string;

    file_input_class_style?: string;

    preview_wrapper_class_style?: string;

    img_preview_class_style?: string;

    generic_file_preview_wrapper_class_style?: string;

    generic_file_preview_icon_class_style?: string;

    generic_file_preview_content_class_style?: string;
    
}


/* ---------------------------------- */
/* Props Interface                    */
/* ---------------------------------- */

export interface InputUIPropsInterface {

    id?: string;

    switch_btn_id?: string;

    type: InputType;

    model_value?: InputValue;

    placeholder_text?: string;

    content_props?: InputUIContentOptionsInterface;

    boolean_props?: InputUIBooleanPropsInterface;

    option_props?: SelectOptionInterface[];

    number_props?: InputUINumberPropsInterface;

    file_props?: InputUIFilePropsInterface;

    action_props?: InputUIActionPropsInterface;

    helper_text?: string;

    class_styles?: InputUIClassStylesInterface;

}


export interface InputUIStateDataInterface {
    input_value: InputValue;

    start_date: string | null;

    end_date: string | null;

    error_text: string | null;

    is_loading: boolean;

    is_dropdown_open: boolean;

    record_options: SelectOptionInterface[],

    search_value: string | null;

    current_page: number;

    total_pages: number;
}

export interface InputUIComputedDataInterface {
    has_error: boolean;

    preview_url: string | null;

    is_image_preview: boolean;

    file_name: string | null;
}

export interface InputUIComponentsInterface {
    TextInputUI: Component;

    TextAreaInputUI: Component;

    CheckboxInputUI: Component;

    NumberInputUI: Component;

    SelectInputUI: Component;

    SelectSearchInputUI: Component;

    SwitchInputUI: Component;

    OtpInputUI: Component;

    FileInputUI: Component;

    PhoneNumberInputUI: Component;

    SearchInputUI: Component;

    DateInputUI: Component;

    DateRangeInputUI: Component;

    VueDatePicker: Component;

}

export interface InputUIContentPayloadInterface {
    label_text?: string;

    placeholder_text?: string;

    helper_text?: string;

    options_list?: SelectOptionInterface[];

    required_text?: string;
}
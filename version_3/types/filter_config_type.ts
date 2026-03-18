import { InputType, InputUIPropsInterface, SelectOptionInterface } from "../ui_types/input_ui_type";


export interface ListFilterConfig {
    key: string; // used in filter_values + query
    type: InputType;
    label_content_key: string;
    input_content_key?: string;
    options_content_key?: string;
    options?: SelectOptionInterface[];
    overides?: Partial<InputUIPropsInterface>
}
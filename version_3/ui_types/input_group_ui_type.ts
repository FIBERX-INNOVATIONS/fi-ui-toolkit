import { InputUIPropsInterface } from "./input_ui_type";

/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

export interface InputGroupUIClassStylesInterface {

    wrapper_class_style: string;

    label_wrapper_class_style: string;

    label_text_class_style: string;

    required_text_class_style: string;

    group_input_wrapper_class_style: string;
}


/* ---------------------------------- */
/* Props Interface                    */
/* ---------------------------------- */

export interface InputGroupUIPropsInterface {

    id?: string;

    label_text?: string;

    show_required_text?: boolean;

    required_text?: string;

    helper_text?: string;

    input_props?: InputUIPropsInterface;

    class_styles?: InputGroupUIClassStylesInterface;

}
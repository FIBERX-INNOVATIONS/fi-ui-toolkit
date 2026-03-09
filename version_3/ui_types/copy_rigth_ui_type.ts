
/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

export interface CopyRightUIClassStylesInterface {
    wrapper_class_style: string;
    text_class_style: string;
}

/* ---------------------------------- */
/* Props Interface                    */
/* ---------------------------------- */

export interface CopyRightUIPropsInterface {

    year_text?: string;

    powered_by_text?: string;

    author_text?: string;

    class_styles?: CopyRightUIClassStylesInterface

}

export interface CopyRightUIContentPayloadInterface {
    powered_by_text?: string;

    author_text?: string;

    year_text?: string;
}
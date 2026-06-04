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

    class_styles?: CopyRightUIClassStylesInterface;
}

/* ---------------------------------- */
/* State Interface                    */
/* ---------------------------------- */

export interface CopyRightUIStateDataInterface {
    current_year: string;

    is_initialized: boolean;
}

/* ---------------------------------- */
/* Computed                           */
/* ---------------------------------- */

export interface CopyRightUIComputedDataInterface {
    display_year: string;

    copyright_text: string;
}

export interface CopyRightUIContentPayloadInterface {
    powered_by_text?: string;

    author_text?: string;

    year_text?: string;
}

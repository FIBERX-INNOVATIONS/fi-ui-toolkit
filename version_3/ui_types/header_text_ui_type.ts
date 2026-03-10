/* ---------------------------------- */
/* Header Tag Type                    */
/* ---------------------------------- */

export type HeaderTagType =
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6";


/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

export interface HeaderTextUIClassStylesInterface {
    text_class_style: string;
}


/* ---------------------------------- */
/* Props Interface                    */
/* ---------------------------------- */

export interface HeaderTextUIPropsInterface {

    /** Header tag to render */
    header_tag?: HeaderTagType;

    /** Static text value */
    text_value?: string;

    /** Optional class styles */
    class_styles?: HeaderTextUIClassStylesInterface;

}


/* ---------------------------------- */
/* Content Payload Interface          */
/* ---------------------------------- */

export interface HeaderTextUIContentPayloadInterface {
    [key: string]: string;
}
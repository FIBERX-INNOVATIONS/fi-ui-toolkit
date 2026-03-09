
/* ---------------------------------- */
/* Loader Symbol                      */
/* ---------------------------------- */

export interface LoaderSymbolInterface {
    type?: "img" | "icon" | "svg";
    src?: string;
    class_style?: string;
    alt_text?: string;
}

/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

export interface ScreenLoaderClassStylesInterface {
    wrapper_class_style: string;
    loader_class_style: string;
    loader_symbol_class_style: string;
    loader_text_class_style: string;
    loader_symbol_img_class_style: string;
}

/* ---------------------------------- */
/* Props Interface                    */
/* ---------------------------------- */

export interface ScreenLoaderUIPropsInterface {
    visible?: boolean;
    class_styles?: ScreenLoaderClassStylesInterface;
    loader_symbol?: LoaderSymbolInterface;
    loader_text?: string;
}

export interface ScreenLoaderUIContentPayloadInterface { 
    img_src_link?: string | null, 
    img_alt_text?: string | null;
    loader_text?: string | null;
}
import { Component } from "vue";
import { ButtonUIPropsInterface } from "./button_ui_type";

/* ---------------------------------- */
/* File Type                          */
/* ---------------------------------- */

export type FilePreviewType = "image" | "video" | "document" | "unknown";

/* ---------------------------------- */
/* File Item                          */
/* ---------------------------------- */

export interface FilePreviewItemInterface {
    file: File;
    url: string;
    type: FilePreviewType;
}

/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

export interface FilePreviewUploadUIClassStylesInterface {
    wrapper_class_style: string;

    preview_container_class_style: string;

    file_item_wrapper_class_style: string;

    remove_btn_wrapper_class_style: string;

    remove_btn_loader_class_style: string;

    remove_btn_class_style: string;

    remove_file_btn_content_class_style: string;

    bottom_action_wrapper_class_style: string;

    multiple_file_container_class_style?: string;

    single_file_container_class_style?: string;

    add_more_wrapper_class_style?: string;



    add_more_file_btn_content_class_style?: string;
}

/* ---------------------------------- */
/* Action Props                       */
/* ---------------------------------- */

export interface FilePreviewUploadUIActionPropsInterface {

    on_add_more?: () => Promise<boolean>;

    on_remove_file?: (
        file: FilePreviewItemInterface,
        index: number
    ) => Promise<boolean>;

    on_file_upload?: (files: File[]) => Promise<boolean>;

}

export interface FilePreviewUploadUIContentPropsInterface {

    add_more_file_btn_content?: string;

    remove_file_btn_content?: string;

}

/* ---------------------------------- */
/* Props                              */
/* ---------------------------------- */

export interface FilePreviewUploadUIPropsInterface {

    files?: File[];

    multiple?: boolean;

    content_props?: FilePreviewUploadUIContentPropsInterface;

    upload_button_props?: ButtonUIPropsInterface;

    action_props?: FilePreviewUploadUIActionPropsInterface;

    class_styles?: FilePreviewUploadUIClassStylesInterface;
}

/* ---------------------------------- */
/* State                              */
/* ---------------------------------- */

export interface FilePreviewUploadUIStateDataInterface {
    is_adding_more: boolean;

    is_deleting: boolean[];

    files_array: File[];

    preview_files: FilePreviewItemInterface[];
}

/* ---------------------------------- */
/* Computed                           */
/* ---------------------------------- */

export interface FilePreviewUploadUIComputedDataInterface {}

/* ---------------------------------- */
/* Components                         */
/* ---------------------------------- */

export interface FilePreviewUploadUIComponentsInterface {
    ButtonUI: Component;
}
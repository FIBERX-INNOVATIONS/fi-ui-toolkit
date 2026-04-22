import { FilePreviewUploadUIClassStylesInterface } from "../ui_types/file_preview_upload_ui_type";

const FilePreviewUploadUIClassStyles: FilePreviewUploadUIClassStylesInterface = {

    wrapper_class_style: "flex flex-col h-full",

    preview_container_class_style:
        "flex-1 max-h-[500px] overflow-y-auto overflow-x-hidden flex flex-col gap-3",

    file_item_wrapper_class_style:
        "relative border rounded-lg p-2 flex items-center justify-center",

    remove_file_btn_content_class_style: "",

    remove_btn_wrapper_class_style: "absolute top-1 right-1",

    remove_btn_loader_class_style: "w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin",

    remove_btn_class_style:
        "absolute top-1 right-1 text-red-500 cursor-pointer",

    add_more_wrapper_class_style: "border-dashed border-2 p-4 text-center cursor-pointer", 

    bottom_action_wrapper_class_style: "sticky bottom-0 bg-white pt-3 border-dashed border-2 p-4 text-center cursor-pointer",

    add_more_file_btn_content_class_style: "border-dashed border-2 p-4 text-center cursor-pointer",   

};

export default FilePreviewUploadUIClassStyles;
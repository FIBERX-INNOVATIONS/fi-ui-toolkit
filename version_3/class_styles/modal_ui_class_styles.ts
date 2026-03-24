import { ModalUIClassStylesInterface } from "../ui_types/modal_ui_type";

const ModalUIClassStyles: ModalUIClassStylesInterface = {

    wrapper_class_style:
        "absolute inset-0 flex items-center justify-center",

    modal_class_style:
        "bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col w-[600px]",

    header_class_style:
        "flex items-center justify-between px-4 py-3 border-b",

    header_title_wrapper_class_style:
        "flex items-center gap-2",

    header_title_class_style:
        "text-lg font-semibold",

    header_title_img_icon_class_style: "w-[16px] h-[16px] flex items-center justify-center",

    header_close_btn_wrapper_class_style: "",

    close_btn_class_style:
        "text-gray-500 hover:text-black",

    body_class_style:
        "flex-1 overflow-y-auto p-4",

    footer_class_style:
        "border-t px-4 py-3 flex justify-end gap-2"

};

export default ModalUIClassStyles;
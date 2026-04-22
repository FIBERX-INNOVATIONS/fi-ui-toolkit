import { PropType } from "vue";
import FilePreviewUploadUIClassStyles from "../class_styles/file_preview_upload_ui_class_styles";

import {
    FilePreviewUploadUIPropsInterface,
    FilePreviewUploadUIClassStylesInterface,
    FilePreviewUploadUIActionPropsInterface,
    FilePreviewUploadUIContentPropsInterface
} from "../ui_types/file_preview_upload_ui_type";

import { ButtonUIPropsInterface } from "../ui_types/button_ui_type";

const FilePreviewUploadUIProps = {

    files: {
        type: Array as PropType<File[]>,
        default: () => []
    },

    multiple: {
        type: Boolean,
        default: false
    },

    content_props: {
        type: Object as PropType<FilePreviewUploadUIContentPropsInterface>,
        default: () => ({})
    },

    upload_button_props: {
        type: Object as PropType<ButtonUIPropsInterface>,
        default: () => ({})
    },

    action_props: {
        type: Object as PropType<FilePreviewUploadUIActionPropsInterface>,
        default: () => ({})
    },

    class_styles: {
        type: Object as PropType<FilePreviewUploadUIClassStylesInterface>,
        default: () => ({})
    }

} satisfies Record<keyof FilePreviewUploadUIPropsInterface, any>;

export default FilePreviewUploadUIProps;
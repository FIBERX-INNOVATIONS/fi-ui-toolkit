import { reactive } from "vue";

import FilePreviewUploadUIClassStyles from "../class_styles/file_preview_upload_ui_class_styles";

import { FilePreviewUploadUIPropsInterface } from "../ui_types/file_preview_upload_ui_type";

class FilePreviewUploadUIPropsBuilder {

    public static getReactivePropsObject(
        overrides: Partial<FilePreviewUploadUIPropsInterface> = {}
    ): FilePreviewUploadUIPropsInterface {

        return reactive({

            files: overrides.files ?? [],

            upload_button_props: {
                content_props: {
                    button_html_content: "Upload Files"
                },
                ...overrides.upload_button_props
            },

            action_props: {
                ...overrides.action_props
            },

            class_styles: {
                ...FilePreviewUploadUIClassStyles,
                ...overrides.class_styles
            }

        });
    }
}

export default FilePreviewUploadUIPropsBuilder;
import { reactive } from "vue";

import BasePropSchema from "../base_classes/base_prop_schema";
import FilePreviewUploadUIClassStyles from "../class_styles/file_preview_upload_ui_class_styles";

import { FilePreviewUploadUIPropsInterface } from "../ui_types/file_preview_upload_ui_type";

class FilePreviewUploadUIPropsBuilder extends BasePropSchema<FilePreviewUploadUIPropsInterface> {
    public static readonly static_prop_keys = [
        "action_props",
        "class_styles"
    ] satisfies readonly (keyof FilePreviewUploadUIPropsInterface)[];

    public static getReactivePropsObject(
        overrides: Partial<FilePreviewUploadUIPropsInterface> = {}
    ): FilePreviewUploadUIPropsInterface {
        return this.createReactiveProps<FilePreviewUploadUIPropsInterface>({
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

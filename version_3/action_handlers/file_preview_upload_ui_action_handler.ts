import BaseActionHandler from "../base_classes/base_action_handler";
import BaseController from "../base_classes/base_controller";
import FilePreviewUploadUIController from "../controllers/file_preview_upload_ui_controller";

import { ButtonUIPropsInterface } from "../ui_types/button_ui_type";

import {
    FilePreviewItemInterface,
    FilePreviewType,
    FilePreviewUploadUIComponentsInterface,
    FilePreviewUploadUIComputedDataInterface,
    FilePreviewUploadUIPropsInterface,
    FilePreviewUploadUIStateDataInterface
} from "../ui_types/file_preview_upload_ui_type";

class FilePreviewUploadUIActionHandler extends BaseActionHandler<
    FilePreviewUploadUIPropsInterface,
    FilePreviewUploadUIStateDataInterface,
    FilePreviewUploadUIComputedDataInterface,
    FilePreviewUploadUIComponentsInterface
> {
    constructor(
        controller: BaseController<
            FilePreviewUploadUIPropsInterface,
            FilePreviewUploadUIStateDataInterface,
            FilePreviewUploadUIComputedDataInterface,
            FilePreviewUploadUIComponentsInterface
        >
    ) {
        super(controller);
    }

    public getFileType = (file: File): FilePreviewType => {
        const type = file.type;

        if (type.startsWith("image")) return "image";
        if (type.startsWith("video")) return "video";
        if (type.includes("pdf") || type.includes("document")) return "document";

        return "unknown";
    };

    public generatePreviewFiles = (files: File[]): FilePreviewItemInterface[] => {
        return files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
            type: this.getFileType(file)
        }));
    };

    public handleAddMore = async (event: Event): Promise<void> => {
        await this.runWithLoading("is_adding_more", async () => {
            const result = await this.invokeAction(this.props.action_props?.on_add_more);

            if (!result) {
                this.logger.warn("Add more action was not successful");
                return;
            }

            const controller = this.controller as FilePreviewUploadUIController;
            const file_input_ref = controller.file_input_ref.value;

            if (file_input_ref) {
                file_input_ref.value = "";
                file_input_ref.click();
            }
        });
    };

    public handleOnFileInputChange = async (event: Event): Promise<void> => {
        const target = event.target as HTMLInputElement;

        if (!target.files) {
            this.logger.warn("No files selected");
            return;
        }

        const files = Array.from(target.files);

        this.state_refs.files_array.value.push(...files);
        this.state_refs.preview_files.value.push(...this.generatePreviewFiles(files));
    };

    public handleRemoveFile = async (index: number): Promise<void> => {
        this.state_refs.is_deleting.value[index] = true;

        try {
            const file = this.state_refs.preview_files.value[index];

            if (!file) {
                return;
            }

            this.state_refs.files_array.value.splice(index, 1);
            this.state_refs.preview_files.value.splice(index, 1);

            await this.invokeAction(this.props.action_props?.on_remove_file, file, index);
        } catch (error: unknown) {
            this.logError("handleRemoveFile", error);
        } finally {
            this.state_refs.is_deleting.value[index] = false;
        }
    };

    public handleFileUpload = async (event?: MouseEvent, config?: { props: ButtonUIPropsInterface }): Promise<void> => {
        try {
            const files = this.state_refs.files_array.value;

            if (files.length === 0) {
                this.logger.warn("No files to upload");
                return;
            }

            await this.invokeAction(this.props.action_props?.on_file_upload, files);
        } catch (error: unknown) {
            this.logError("handleFileUpload", error);
        }
    };
}

export default FilePreviewUploadUIActionHandler;

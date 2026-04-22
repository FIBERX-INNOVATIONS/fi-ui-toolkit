import BaseController from "../base_classes/base_controller";
import FilePreviewUploadUIController from "../controllers/file_preview_upload_ui_controller";
import { ButtonActionMethodReturnInterface, ButtonUIPropsInterface } from "../ui_types/button_ui_type";

import {
    FilePreviewUploadUIPropsInterface,
    FilePreviewUploadUIStateDataInterface,
    FilePreviewUploadUIComputedDataInterface,
    FilePreviewUploadUIComponentsInterface,
    FilePreviewItemInterface,
    FilePreviewType
} from "../ui_types/file_preview_upload_ui_type";
import LoggerUtil from "../utils/logger_util";

class FilePreviewUploadUIActionHandler {
    private logger: LoggerUtil = new LoggerUtil({ prefix: "FilePreviewUploadUIActionHandler", show_timestamp: true });

    constructor(
        private controller: BaseController<
            FilePreviewUploadUIPropsInterface,
            FilePreviewUploadUIStateDataInterface,
            FilePreviewUploadUIComputedDataInterface,
            FilePreviewUploadUIComponentsInterface
        >
    ) {}


    // Method to get file type
    public getFileType = (file: File): FilePreviewType => {

        const type = file.type;

        if (type.startsWith("image")) return "image";
        if (type.startsWith("video")) return "video";
        if (type.includes("pdf") || type.includes("document")) return "document";

        return "unknown";
    }

    // Method to generate preview files
    public generatePreviewFiles = (files: File[]): FilePreviewItemInterface[] => {
            return files.map(file => ({
                file,
                url: URL.createObjectURL(file),
                type: this.getFileType(file)
            }));
        }

    // Method to handle adding more files
    public handleAddMore = async (e: Event): Promise<void> => {
        this.controller.state_refs.is_adding_more.value = true;

        try {
            const result = await this.controller.props.action_props?.on_add_more?.();

            if(!result) {
                this.logger.warn(`Add more action was not successful`);
                return;
            }

            const controller        = this.controller as FilePreviewUploadUIController;
            const file_input_ref    = controller.file_input_ref.value;

            if(file_input_ref) {
                file_input_ref.value = "";
                file_input_ref.click(); 
            }

            return;
        }
        catch(error: unknown) {
            this.logger.error(`Failed to add more files`, { error });
            return
        }
        finally{
            this.controller.state_refs.is_adding_more.value = false;
        }
    }

    // Method to handle on file input change
    public handleOnFileInputChange = async (e: Event): Promise<void> => {

        const target = e.target as HTMLInputElement;

        if(!target.files) {
            this.logger.warn(`No files selected`);
            return;
        }

        const files = Array.from(target.files);

        this.controller.state_refs.files_array.value.push(...files);
        this.controller.state_refs.preview_files.value.push(...this.generatePreviewFiles(files));
    }

    // Method to handle removing a file
    public async handleRemoveFile(index: number) {
        this.controller.state_refs.is_deleting.value[index] = true;

        try {
            const file = this.controller.state_refs.preview_files.value[index];

            if(!file) {
                return;
            }

            this.controller.state_refs.files_array.value.splice(index, 1);
            this.controller.state_refs.preview_files.value.splice(index, 1);

            await this.controller.props.action_props?.on_remove_file?.(
                file,
                index
            );

            return;
        }
        catch(error: unknown) {
            this.logger.error(`Failed to add more files`, { error });
            return
        }
        finally{
            this.controller.state_refs.is_deleting.value[index] = false;
        }
    }

    // Method to handle file upload
    public handleFileUpload = async (
        event?: MouseEvent,
        config?: { props: ButtonUIPropsInterface }
    ): Promise<void> => {
        try {
            const files = this.controller.state_refs.files_array.value;

            if(files.length === 0) {
                this.logger.warn(`No files to upload`);
                return;
            }
            
            await this.controller.props.action_props?.on_file_upload?.(files);
            return;

        } catch(error: unknown) {
            this.logger.error(`Failed to upload files`, { error });
            return;
        }
    }
}

export default FilePreviewUploadUIActionHandler;
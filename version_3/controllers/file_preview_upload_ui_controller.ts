import { ref,  } from "vue";

import BaseController from "../base_classes/base_controller";

import {
    FilePreviewUploadUIPropsInterface,
    FilePreviewUploadUIStateDataInterface,
    FilePreviewUploadUIComputedDataInterface,
    FilePreviewUploadUIComponentsInterface,
    FilePreviewItemInterface,
    FilePreviewType
} from "../ui_types/file_preview_upload_ui_type";

import FilePreviewUploadUIActionHandler from "../action_handlers/file_preview_upload_ui_action_handler";

import ButtonUI from "../components/ButtonUI.vue";

class FilePreviewUploadUIController extends BaseController<
    FilePreviewUploadUIPropsInterface,
    FilePreviewUploadUIStateDataInterface,
    FilePreviewUploadUIComputedDataInterface,
    FilePreviewUploadUIComponentsInterface
>{

    public action_handler = new FilePreviewUploadUIActionHandler(this);

    public file_input_ref = ref<HTMLInputElement | null>(null);

    constructor(props: FilePreviewUploadUIPropsInterface) {
        super("file_preview_upload_ui", props);
        this.getComponentDefinition();
    }

    protected getUIComponents(): FilePreviewUploadUIComponentsInterface {
        return { ButtonUI };
    }

    protected getUIStateData(): FilePreviewUploadUIStateDataInterface {

        return {
            is_adding_more: false,

            is_deleting: this.props.files ? new Array(this.props.files.length).fill(false) : [],

            files_array: this.props.files || [],

            preview_files: this.action_handler.generatePreviewFiles(this.props.files || [])
        };
    }

}

export default FilePreviewUploadUIController;
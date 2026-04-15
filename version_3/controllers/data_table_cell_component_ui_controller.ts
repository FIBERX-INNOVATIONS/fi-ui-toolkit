

import BaseController  from "../base_classes/base_controller";

import { ComputedDefinitionType } from "../types/base_type";

import DataTableCellComponentUIActionHandler from "../action_handlers/data_table_cell_component_ui_action_handler";

import { 
    DataTableCellComponentUIPropsInterface,
    DataTableCellComponentUIStateDataInterface,
    DataTableCellComponentUIComputedDataInterface,
    DataTableCellComponentUIComponentsInterface,
} from "../ui_types/data_table_cell_component_ui_type";

import ImageRenderUI from "../components/ImageRenderUI.vue";
import SwitchInputUI from "../components/InputUI/SwitchInputUI.vue";
import HeaderTextUI from "../components/HeaderTextUI.vue";
import ButtonUI from "../components/ButtonUI.vue";
import CheckboxInputUI from "../components/InputUI/CheckboxInputUI.vue";


class DataTableCellComponentUIController<T = any> extends BaseController<
    DataTableCellComponentUIPropsInterface,
    DataTableCellComponentUIStateDataInterface,
    DataTableCellComponentUIComputedDataInterface,
    DataTableCellComponentUIComponentsInterface
> {
    public action_handler: DataTableCellComponentUIActionHandler = new DataTableCellComponentUIActionHandler(this);

    constructor(props: DataTableCellComponentUIPropsInterface) {
        super("data_table_cell_component_ui", props);
        this.getComponentDefinition();
    }

    protected getUIComponents(): DataTableCellComponentUIComponentsInterface {
        return {
            ImageRenderUI,

            SwitchInputUI,

            CheckboxInputUI,

            HeaderTextUI,

            ButtonUI
        };
    }

    protected getUIStateData(): DataTableCellComponentUIStateDataInterface {

        return {

        };

    }

    protected getUIComputedData(): ComputedDefinitionType<DataTableCellComponentUIComputedDataInterface> {

        return {
            raw_record_value: this.action_handler.getRecordValueByColKey,
            
            serial_value: this.action_handler.getSerialValue,

            img_src: this.action_handler.getImgSrc,

            img_alt_text: this.action_handler.getImgAltText,

            img_content: this.action_handler.getImgContent,

            img_sub_text: this.action_handler.getImgSubText,

            link_url: this.action_handler.getLinkURL,

            link_text: this.action_handler.getLinkText,

            link_icon: this.action_handler.getLinkIcon,

            text_content: this.action_handler.getTextContent,

            input_model_value: this.action_handler.getInputModelValue,

            input_content_props: this.action_handler.getInputContentProps,

            input_boolean_props: this.action_handler.getInputBooleanProps,

            input_action_props: this.action_handler.getInputActionProps,
        };

    }

}

export default DataTableCellComponentUIController;
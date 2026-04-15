

import { getSVGIconValue, SVGIconValue } from "../resources/svg_icon_resource";

import BaseController from "../base_classes/base_controller";

import { 
    DataTableCellComponentUIPropsInterface,
    DataTableCellComponentUIStateDataInterface,
    DataTableCellComponentUIComputedDataInterface,
    DataTableCellComponentUIComponentsInterface,
} from "../ui_types/data_table_cell_component_ui_type";

import InputTransformerUtil from "../utils/input_transformer_util";

import { 
    InputUIActionPropsInterface,
    InputUIBooleanPropsInterface, 
    InputUIContentOptionsInterface, 
    InputValue 
} from "../ui_types/input_ui_type";

class DataTableCellComponentUIActionHandler {

    private controller: BaseController<
        DataTableCellComponentUIPropsInterface,
        DataTableCellComponentUIStateDataInterface,
        DataTableCellComponentUIComputedDataInterface,
        DataTableCellComponentUIComponentsInterface
    >;

    constructor(
        controller: BaseController<
            DataTableCellComponentUIPropsInterface,
            DataTableCellComponentUIStateDataInterface,
            DataTableCellComponentUIComputedDataInterface,
            DataTableCellComponentUIComponentsInterface
        >
    ) {
        this.controller = controller;
    }

    // Method to get record value from column key, used as fallback for various render values
    public getRecordValueByColKey = (): string | undefined => {
        const { props } = this.controller;

        const { 
            record,
            column
        } = props;

        return column?.key && record ? record[column.key]?.toString() : "";
    }

    // Method to get serial value for the cell, used when column type is set to "serial"
    public getSerialValue = (): string | number | undefined => {

        const { props } = this.controller;

        const { 
            record_index = 0, 
            column 
        } = props;

        const base_value = record_index + 1;

        const {
            prefix = "",
            suffix = "",
            pad_start
        } = column?.props || {};

        let formatted_value: string | number = base_value;

        if (pad_start) {
            formatted_value = String(base_value).padStart(pad_start, "0");
        }

        return `${prefix}${formatted_value}${suffix}`;
    }

    // Methods to get image render values, with fallback to record value by column key if specific render method is not provided in column props
    public getImgSrc = (): string | undefined => {

        const { props } = this.controller;

        const { 
            record,
            column
        } = props;

        if(column?.props?.getImgSrc) {
            return column.props.getImgSrc?.(record);
        }

        return this.getRecordValueByColKey();
    }

    // Method to get image alt text, with fallback to record value by column key if specific render method is not provided in column props
    public getImgAltText = (): string | undefined => {

        const { props } = this.controller;

        const { 
            record,
            column
        } = props;

        if(column?.props?.getImgAltText) {
            return column.props.getImgAltText?.(record);
        }

        return this.getRecordValueByColKey();
    }

    // Method to get image content text, with fallback to record value by column key if specific render method is not provided in column props
    public getImgContent = (): string | undefined => {

        const { props } = this.controller;

        const { 
            record,
            column
        } = props;

        if(column?.props?.getImgContent) {
            return column.props.getImgContent?.(record);
        }

        return this.getRecordValueByColKey();
    }

    // Method to get image sub text, with fallback to record value by column key if specific render method is not provided in column props
    public getImgSubText = (): string | undefined => {

        const { props } = this.controller;

        const { 
            record,
            column
        } = props;

        if(column?.props?.getImgSubText) {
            return column.props.getImgSubText?.(record);
        }

        return this.getRecordValueByColKey();
    }

    // Method to get link URL, with fallback to record value by column key if specific render method is not provided in column props
    public getLinkURL = (): string | undefined => {
        const { props } = this.controller;

        const { 
            record,
            column
        } = props;

        if(column?.props?.getLinkURL) {
            return column.props.getLinkURL?.(record);
        }

        return this.getRecordValueByColKey();
    }

    // Method to get link text, with fallback to record value by column key if specific render method is not provided in column props
    public getLinkText = (): string | undefined => {
        const { props } = this.controller;

        const { 
            record,
            column
        } = props;

        if(column?.props?.getLinkText) {
            return column.props.getLinkText?.(record);
        }

        return this.getRecordValueByColKey();
    }

    // Method to get link icon, with fallback to default link icon if specific icon key is not provided in column props
    public getLinkIcon = (): SVGIconValue | string | undefined => {
        const { props } = this.controller;

        const { 
            record,
            column
        } = props;

        if(column?.props?.icon_key) {
            return getSVGIconValue(column.props.icon_key);
        }

       return getSVGIconValue("link_square_arrow_top_right_svg_icon");
    }

    // Method to get date text content, with fallback to record value by column key if specific render method is not provided in column props
    public getTextContent = (): string | undefined => {
        const { props } = this.controller;

        const { 
            record,
            column
        } = props;

        if(column?.props?.getDateTextContent) {
            return column.props.getDateTextContent?.(record);
        }   

        const date_value = this.getRecordValueByColKey();

        if(date_value) {
            return date_value;
        }

        return "-";
    }

    // Method to get input model value
    public getInputModelValue = (): InputValue | undefined => {
        const { record, column, record_index } = this.controller.props;

        if(!record || !column || !column?.props?.input_model_value) {
            return undefined;
        }

        const { input_model_value } = column?.props;

        return input_model_value?.(record, record_index)

    }

    // Method to get input content props value
    public getInputContentProps = (): InputUIContentOptionsInterface | undefined => {
        const { record, column, record_index } = this.controller.props;

        if(!record || !column || !column?.props?.input_content_props) {
            return undefined;
        }

        const { input_content_props } = column?.props;

        return input_content_props?.(record, record_index)

    }

    // Method to get input boolean props value
    public getInputBooleanProps = (): InputUIBooleanPropsInterface | undefined => {
        const { record, column, record_index } = this.controller.props;

        if(!record || !column || !column?.props?.input_ui_boolean_props) {
            return undefined;
        }

        const { input_ui_boolean_props } = column?.props;

        return input_ui_boolean_props?.(record, record_index)

    }

    // Method to get input action props value
    public getInputActionProps = (): InputUIActionPropsInterface | undefined => {
        const { record, column, record_index } = this.controller.props;

        if(!column || !column?.props?.input_action_props) {
            return undefined;
        }

        const { input_action_props } = column?.props;

        return input_action_props?.(record, record_index)

    }



}

export default DataTableCellComponentUIActionHandler;
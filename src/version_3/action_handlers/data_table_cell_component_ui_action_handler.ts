import BaseActionHandler from "../base_classes/base_action_handler";
import BaseController from "../base_classes/base_controller";

import { getSVGIconValue, SVGIconValue } from "../resources/svg_icon_resource";

import {
    DataTableCellComponentUIComponentsInterface,
    DataTableCellComponentUIComputedDataInterface,
    DataTableCellComponentUIPropsInterface,
    DataTableCellComponentUIStateDataInterface
} from "../ui_types/data_table_cell_component_ui_type";

import {
    InputUIActionPropsInterface,
    InputUIBooleanPropsInterface,
    InputUIContentOptionsInterface,
    InputValue
} from "../ui_types/input_ui_type";

class DataTableCellComponentUIActionHandler extends BaseActionHandler<
    DataTableCellComponentUIPropsInterface,
    DataTableCellComponentUIStateDataInterface,
    DataTableCellComponentUIComputedDataInterface,
    DataTableCellComponentUIComponentsInterface
> {
    constructor(
        controller: BaseController<
            DataTableCellComponentUIPropsInterface,
            DataTableCellComponentUIStateDataInterface,
            DataTableCellComponentUIComputedDataInterface,
            DataTableCellComponentUIComponentsInterface
        >
    ) {
        super(controller);
    }

    private getColumnPropValue<TValue>(prop_key: string, fallback?: () => TValue | undefined): TValue | undefined {
        const { record, column, record_index } = this.props;
        const column_props = column?.props as Record<string, any> | undefined;
        const prop_value = column_props?.[prop_key];

        if (typeof prop_value === "function") {
            return prop_value(record, record_index);
        }

        return fallback?.();
    }

    public getRecordValueByColKey = (): string | undefined => {
        const { record, column } = this.props;

        return column?.key && record ? record[column.key]?.toString() : "";
    };

    public getSerialValue = (): string | number | undefined => {
        const { record_index = 0, column } = this.props;
        const base_value = record_index + 1;

        const { prefix = "", suffix = "", pad_start } = column?.props || {};

        const formatted_value = pad_start ? String(base_value).padStart(pad_start, "0") : base_value;

        return `${prefix}${formatted_value}${suffix}`;
    };

    public getImgSrc = (): string | undefined => {
        return this.getColumnPropValue("getImgSrc", this.getRecordValueByColKey);
    };

    public getImgAltText = (): string | undefined => {
        return this.getColumnPropValue("getImgAltText", this.getRecordValueByColKey);
    };

    public getImgContent = (): string | undefined => {
        return this.getColumnPropValue("getImgContent", this.getRecordValueByColKey);
    };

    public getImgSubText = (): string | undefined => {
        return this.getColumnPropValue("getImgSubText", this.getRecordValueByColKey);
    };

    public getLinkURL = (): string | undefined => {
        return this.getColumnPropValue("getLinkURL", this.getRecordValueByColKey);
    };

    public getLinkText = (): string | undefined => {
        return this.getColumnPropValue("getLinkText", this.getRecordValueByColKey);
    };

    public getLinkIcon = (): SVGIconValue | string | undefined => {
        const { column } = this.props;

        if (column?.props?.icon_key) {
            return getSVGIconValue(column.props.icon_key);
        }

        return getSVGIconValue("link_square_arrow_top_right_svg_icon");
    };

    public getTextContent = (): string | undefined => {
        return (
            this.getColumnPropValue<string>("getDateTextContent") ??
            this.getColumnPropValue<string>("getTextContent") ??
            this.getRecordValueByColKey() ??
            "-"
        );
    };

    public getInputModelValue = (): InputValue | undefined => {
        return this.getColumnPropValue<InputValue>("input_model_value");
    };

    public getInputContentProps = (): InputUIContentOptionsInterface | undefined => {
        return this.getColumnPropValue<InputUIContentOptionsInterface>("input_content_props");
    };

    public getInputBooleanProps = (): InputUIBooleanPropsInterface | undefined => {
        return this.getColumnPropValue<InputUIBooleanPropsInterface>("input_ui_boolean_props");
    };

    public getInputActionProps = (): InputUIActionPropsInterface | undefined => {
        return this.getColumnPropValue<InputUIActionPropsInterface>("input_action_props");
    };
}

export default DataTableCellComponentUIActionHandler;

import BaseController from "../base_classes/base_controller";

import { ComputedDefinitionType } from "../types/base_type";

import ButtonUI from "../components/ButtonUI.vue";

import {
    DataTableResultAndBulkActionBarUIPropsInterface,
    DataTableResultAndBulkActionBarUIStateDataInterface,
    DataTableResultAndBulkActionBarUIComputedDataInterface,
    DataTableResultAndBulkActionBarUIComponentsInterface
} from "../ui_types/data_table_result_and_bulk_action_bar_ui_type";

import ContentManagerUtil from "../utils/content_manager_util";

class DataTableResultAndBulkActionBarUIUIController extends BaseController<
    DataTableResultAndBulkActionBarUIPropsInterface,
    DataTableResultAndBulkActionBarUIStateDataInterface,
    DataTableResultAndBulkActionBarUIComputedDataInterface,
    DataTableResultAndBulkActionBarUIComponentsInterface
> {
    public content_manager: ContentManagerUtil = ContentManagerUtil.getInstance();

    constructor(props: DataTableResultAndBulkActionBarUIPropsInterface) {
        super("data_table_result_and_bulk_action_bar_ui", props);
        this.getComponentDefinition();
    }

    protected getUIComponents(): DataTableResultAndBulkActionBarUIComponentsInterface {
        return {
            ButtonUI
        };
    }

    protected getUIStateData(): DataTableResultAndBulkActionBarUIStateDataInterface {
        return {};
    }

    protected getUIComputedData(): ComputedDefinitionType<DataTableResultAndBulkActionBarUIComputedDataInterface> {

        return {

            computed_header_text: (): string => {

                const { data_props, content_props } = this.props;

                const {
                    total_records,
                    filtered_records,
                    current_page,
                    total_pages
                } = data_props;

                const showing = filtered_records ?? total_records;

                if (content_props?.header_text_key) {
                    return this.content_manager.getWithRecord<string>(
                        content_props.header_text_key,
                        {...data_props, showing },
                        `Showing ${showing} of ${total_records} records (Page ${current_page} of ${total_pages})`
                    ) ?? "";
                }

                return `Showing ${showing} of ${total_records} records (Page ${current_page} of ${total_pages})`;

            },

            show_bulk_button: (): boolean => {

                const { selection_props } = this.props;

                if (!selection_props?.show_bulk_button) {
                    return false;
                }

                return (selection_props.selected_count ?? 0) > 0;
            }

        };

    }

}

export default DataTableResultAndBulkActionBarUIUIController;
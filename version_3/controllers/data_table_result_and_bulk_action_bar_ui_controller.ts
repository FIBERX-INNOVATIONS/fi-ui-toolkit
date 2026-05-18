import BaseController from "../base_classes/base_controller";

import { ComputedDefinitionType, WatchersType } from "../types/base_type";

import ButtonUI from "../components/ButtonUI.vue";

import {
    DataTableResultAndBulkActionBarUIPropsInterface,
    DataTableResultAndBulkActionBarUIStateDataInterface,
    DataTableResultAndBulkActionBarUIComputedDataInterface,
    DataTableResultAndBulkActionBarUIComponentsInterface
} from "../ui_types/data_table_result_and_bulk_action_bar_ui_type";

import ContentManagerUtil from "../utils/content_manager_util";

class DataTableResultAndBulkActionBarUIController extends BaseController<
    DataTableResultAndBulkActionBarUIPropsInterface,
    DataTableResultAndBulkActionBarUIStateDataInterface,
    DataTableResultAndBulkActionBarUIComputedDataInterface,
    DataTableResultAndBulkActionBarUIComponentsInterface
> {
    private content_manager: ContentManagerUtil = ContentManagerUtil.getInstance();

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
        return {
            is_initialized: true
        };
    }

    protected getUIComputedData(): ComputedDefinitionType<DataTableResultAndBulkActionBarUIComputedDataInterface> {
        return {
            display_record_count: (): number => {
                const { data_props } = this.props;
                return data_props.filtered_records ?? data_props.total_records;
            },

            computed_header_text: (): string => {
                const { data_props, content_props } = this.props;

                const showing = this.computed_refs.display_record_count.value;

                if (content_props?.header_text_key) {
                    return (
                        this.content_manager.getWithRecord<string>(
                            content_props.header_text_key,
                            { ...data_props, showing },
                            `Showing ${showing} of ${data_props.total_records} records (Page ${data_props.current_page} of ${data_props.total_pages})`
                        ) ?? ""
                    );
                }

                return `Showing ${showing} of ${data_props.total_records} records (Page ${data_props.current_page} of ${data_props.total_pages})`;
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

    protected getUIWatchers(): WatchersType<
        DataTableResultAndBulkActionBarUIPropsInterface,
        DataTableResultAndBulkActionBarUIStateDataInterface
    > {
        return {
            data_props: {
                handler: () => {
                    // Force computed updates when data props change
                },
                options: { deep: true }
            },

            selection_props: {
                handler: () => {
                    // Force computed updates when selection changes
                },
                options: { deep: true }
            }
        };
    }
}

export default DataTableResultAndBulkActionBarUIController;

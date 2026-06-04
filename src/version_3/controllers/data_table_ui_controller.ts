import BaseController from "../base_classes/base_controller";

import { ComputedDefinitionType, WatchersType } from "../types/base_type";

import DataTableUIActionHandler from "../action_handlers/data_table_ui_action_handler";

import {
    DataTableUIPropsInterface,
    DataTableUIStateDataInterface,
    DataTableUIComputedDataInterface,
    DataTableUIComponentsInterface
} from "../ui_types/data_table_ui_type";

class DataTableUIController<T extends Record<string, any> = Record<string, any>> extends BaseController<
    DataTableUIPropsInterface<T>,
    DataTableUIStateDataInterface<T>,
    DataTableUIComputedDataInterface<T>,
    DataTableUIComponentsInterface
> {
    constructor(props: DataTableUIPropsInterface<T>) {
        super("data_table_ui", props);

        this.setActionHandler(new DataTableUIActionHandler<T>(this));

        this.getComponentDefinition();
    }

    protected getUIStateData(): DataTableUIStateDataInterface<T> {
        return {
            loading: this.props.is_loading ?? false,

            sort_key: null,

            sort_direction: null
        };
    }

    protected getUIComputedData(): ComputedDefinitionType<DataTableUIComputedDataInterface<T>> {
        return {
            has_data: (): boolean => {
                return Array.isArray(this.props.data) && this.props.data.length > 0;
            },

            is_empty: (): boolean => {
                return !this.computed_refs.has_data.value;
            },

            display_data: (): T[] => {
                return Array.isArray(this.props.data) ? this.props.data : [];
            }
        };
    }

    protected getUIWatchers(): WatchersType<DataTableUIPropsInterface<T>, DataTableUIStateDataInterface<T>> {
        return {
            is_loading: {
                handler: (new_value: boolean | undefined) => {
                    this.state_refs.loading.value = new_value ?? false;
                }
            },

            table_render_obj: {
                handler: () => {
                    // Reset sort state when render config changes
                    this.state_refs.sort_key.value = null;
                    this.state_refs.sort_direction.value = null;
                },
                options: { deep: true }
            },

            data: {
                handler: () => {
                    // Force computed updates when data changes
                },
                options: { deep: true }
            }
        };
    }
}

export default DataTableUIController;

import BaseActionHandler from "../base_classes/base_action_handler";
import BaseController from "../base_classes/base_controller";

import {
    FiltersPanelUIComponentsInterface,
    FiltersPanelUIComputedDataInterface,
    FiltersPanelUIPropsInterface,
    FiltersPanelUIStateDataInterface
} from "../ui_types/filters_panel_ui_type";

class FiltersPanelUIActionHandler extends BaseActionHandler<
    FiltersPanelUIPropsInterface,
    FiltersPanelUIStateDataInterface,
    FiltersPanelUIComputedDataInterface,
    FiltersPanelUIComponentsInterface
> {
    constructor(
        controller: BaseController<
            FiltersPanelUIPropsInterface,
            FiltersPanelUIStateDataInterface,
            FiltersPanelUIComputedDataInterface,
            FiltersPanelUIComponentsInterface
        >
    ) {
        super(controller);
    }

    public togglePanel = (): void => {
        this.setState("is_open", !this.state_refs.is_open.value);
    };

    public applyFilters = async (): Promise<void> => {
        const filter_values = this.state_refs.filter_values.value;

        if (this.props.sync_route_query) {
            const new_query: Record<string, any> = { ...this.controller.route.query };

            Object.keys(filter_values).forEach((key) => {
                const filter_raw_value = filter_values[key];

                if (filter_raw_value !== null && filter_raw_value !== "" && filter_raw_value !== undefined) {
                    new_query[key] =
                        typeof filter_raw_value === "string" ? filter_raw_value : JSON.stringify(filter_raw_value);
                } else {
                    delete new_query[key];
                }
            });

            await this.controller.router.replace({ query: new_query });
        }

        const { on_apply_filters } = this.props.action_props || {};

        await this.invokeAction(on_apply_filters, filter_values);
    };

    public clearFilters = async (): Promise<void> => {
        const filter_keys = Object.keys(this.state_refs.filter_values.value);

        this.setState("filter_values", {});

        if (this.props.sync_route_query) {
            const new_query: Record<string, any> = { ...this.controller.route.query };

            filter_keys.forEach((key) => {
                delete new_query[key];
            });

            await this.controller.router.replace({ query: new_query });
        }

        const { on_clear_filters } = this.props.action_props || {};

        await this.invokeAction(on_clear_filters);
    };
}

export default FiltersPanelUIActionHandler;

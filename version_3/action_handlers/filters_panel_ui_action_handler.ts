

import BaseController from "../base_classes/base_controller";

import { 
    FiltersPanelUIPropsInterface,
    FiltersPanelUIStateDataInterface,
    FiltersPanelUIComputedDataInterface,
    FiltersPanelUIComponentsInterface,
} from "../ui_types/filters_panel_ui_type";

class FiltersPanelUIActionHandler {

    private controller: BaseController<
        FiltersPanelUIPropsInterface,
        FiltersPanelUIStateDataInterface,
        FiltersPanelUIComputedDataInterface,
        FiltersPanelUIComponentsInterface
    >;

    constructor(
        controller: BaseController<
            FiltersPanelUIPropsInterface,
            FiltersPanelUIStateDataInterface,
            FiltersPanelUIComputedDataInterface,
            FiltersPanelUIComponentsInterface
        >
    ) {
        this.controller = controller;
    }


    // Method to toggle filter panel
    public togglePanel  = () => {

        const { state_refs } = this.controller;

        this.controller.state_refs.is_open.value = !state_refs.is_open.value;

        return;

    }

    // Method to apply filters
    public applyFilters = async () => {

        const { state_refs, props, route, router } = this.controller;

        const filter_values = state_refs.filter_values.value;

        if (props.sync_route_query) {

            const new_query: Record<string, any> = {
                ...route.query
            };

            Object.keys(filter_values).forEach((key) => {

                const value = filter_values[key];

                if (value !== null && value !== "" && value !== undefined) {
                    new_query[key] = value;
                } else {
                    delete new_query[key];
                }

            });

            await router.replace({
                query: new_query
            });

        }

        await props.action_props?.on_apply_filters?.(filter_values);

    }

    // Method to clear filters
    public clearFilters = async () => {

        const { state_refs, props, route, router } = this.controller;

        const filter_keys = Object.keys(state_refs.filter_values.value);

        // reset filter values
        this.controller.state_refs.filter_values.value = {};

        if (props.sync_route_query) {

            const new_query: Record<string, any> = { ...route.query };

            filter_keys.forEach((key) => {
                delete new_query[key];
            });

            await router.replace({
                query: new_query
            });

        }

        await props.action_props?.on_clear_filters?.();

    }


}

export default FiltersPanelUIActionHandler;
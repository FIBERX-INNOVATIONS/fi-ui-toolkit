
import BaseController from "../base_classes/base_controller";

import FiltersPanelUIActionHandler from "../action_handlers/filters_panel_ui_action_handler";

import { 
    FiltersPanelUIComponentsInterface,
    FiltersPanelUIComputedDataInterface, 
    FiltersPanelUIPropsInterface, 
    FiltersPanelUIStateDataInterface 
} from "../ui_types/filters_panel_ui_type";

import InputGroupUI from "../components/InputGroupUI.vue";
import ButtonUI from "../components/ButtonUI.vue";
import { ComputedDefinitionType, WatchersType } from "@ui_v3/types/base_type";


class FiltersPanelUIController extends BaseController<
    FiltersPanelUIPropsInterface,
    FiltersPanelUIStateDataInterface,
    FiltersPanelUIComputedDataInterface,
    FiltersPanelUIComponentsInterface
>{

    public action_handler = new FiltersPanelUIActionHandler (this);

    constructor(props: FiltersPanelUIPropsInterface) {

        super("filters_panel_ui", props);

        this.getComponentDefinition();

    }


    protected getUIComponents(): FiltersPanelUIComponentsInterface {

        return {

            InputGroupUI,
            ButtonUI

        };

    }


    protected getUIStateData(): FiltersPanelUIStateDataInterface {
        const is_empty_query = Object.keys(this.route.query).length === 0;

        return {

            is_open: !is_empty_query ? true : false,

            filter_values: {}

        };

    }


    protected getUIComputedData(): ComputedDefinitionType<FiltersPanelUIComputedDataInterface> {

        return {

            has_filters: () => {

                return Array.isArray(this.props.filter_fields) &&
                    this.props.filter_fields.length > 0;

            }

        };

    }

    protected getUIWatchers(): WatchersType<FiltersPanelUIPropsInterface, FiltersPanelUIStateDataInterface> {
        return {
            props_filter_values: (new_val) => {
                this.state_refs.filter_values.value = {...new_val };
            },
            route: (new_val) => {
                const is_empty_query = Object.keys(new_val.query).length === 0;

                if(!is_empty_query) {
                    this.state_refs.is_open.value = true
                }
            }
        };
    }

    // protected async handleOnMountedLogic(): Promise<void> {
    //     this.action_handler.hydrateFiltersFromRoute();
    // }

}

export default FiltersPanelUIController;
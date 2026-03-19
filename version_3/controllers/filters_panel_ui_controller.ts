
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

        return {

            is_open: false,

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
            }
        };
    }

    // protected async handleOnMountedLogic(): Promise<void> {
    //     this.action_handler.hydrateFiltersFromRoute();
    // }

}

export default FiltersPanelUIController;
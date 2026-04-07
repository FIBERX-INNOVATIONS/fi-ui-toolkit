
import BaseController  from "../base_classes/base_controller";

import { ComputedDefinitionType, WatchersType } from "../types/base_type";

import DataTableUIActionHandler from "../action_handlers/data_table_ui_action_handler";

import { 
    DataTableUIPropsInterface,
    DataTableUIStateDataInterface,
    DataTableUIComputedDataInterface,
    DataTableUIComponentsInterface,
} from "../ui_types/data_table_ui_type";

class DataTableUIController<T = any> extends BaseController<
    DataTableUIPropsInterface<T>,
    DataTableUIStateDataInterface,
    DataTableUIComputedDataInterface<T>,
    DataTableUIComponentsInterface
> {

    public action_handler: DataTableUIActionHandler<T> = 
        new DataTableUIActionHandler<T>(this);

    constructor(props: DataTableUIPropsInterface) {

        super("data_table_ui", props);

        this.getComponentDefinition();

    }

    protected getUIStateData(): DataTableUIStateDataInterface {
        return {
            loading: true,

            sort_key: null as keyof T | null,
            
            sort_direction: null
        };
    }

    protected getUIWatchers(): WatchersType<DataTableUIPropsInterface, DataTableUIStateDataInterface> {
        return {
            table_render_obj: () => {
                this.logger.log("Render object changed");
                return;
            }
        };
    }
}

export default DataTableUIController;

import BaseController  from "../base_classes/base_controller";

import OverlayUIActionHandler from "../action_handlers/overlay_ui_action_handler";

import { ComputedDefinitionType, WatchersType } from "../types/base_type";

import { 
    OverlayUIPropsInterface,
    OverlayUIStateDataInterface,
    OverlayUIComputedDataInterface,
    OverlayUIComponentsInterface
} from "../ui_types/overlay_ui_type";

class OverlayUIController extends BaseController<
    OverlayUIPropsInterface,
    OverlayUIStateDataInterface,
    OverlayUIComputedDataInterface,
    OverlayUIComponentsInterface
>{

    public action_handler: OverlayUIActionHandler =
        new OverlayUIActionHandler(this);

    constructor(props: OverlayUIPropsInterface) {

        super("overlay_ui", props);

        this.getComponentDefinition();

    }

    protected getUIComponents(): OverlayUIComponentsInterface {

        return {};

    }

    protected getUIStateData(): OverlayUIStateDataInterface {

        return {

            is_open: this.props.model_value ?? false

        };

    }

    protected getUIComputedData(): ComputedDefinitionType<OverlayUIComputedDataInterface> {

        return {

            show_overlay: () => {

                return this.state_refs.is_open.value;

            }

        };

    }

    protected getUIWatchers(): WatchersType<OverlayUIPropsInterface, OverlayUIStateDataInterface> {
            return {
                model_value: (new_val) => {
                    this.state_refs.is_open.value = new_val
                }
            };
        }

}

export default OverlayUIController;
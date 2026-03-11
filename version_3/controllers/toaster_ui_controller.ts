import BaseController from "../base_classes/base_controller";

import {
    ToasterUIPropsInterface,
    ToasterUIStateDataInterface,
    ToasterUIComputedDataInterface,
    ToasterUIComponentsInterface
} from "../ui_types/toaster_ui_type";

import ToasterUIActionHandler from "../action_handlers/toaster_ui_action_handler";
import { WatchersType } from "@ui_v3/types/base_type";

class ToasterUIController extends BaseController<
    ToasterUIPropsInterface,
    ToasterUIStateDataInterface,
    ToasterUIComputedDataInterface,
    ToasterUIComponentsInterface
>{

    public action_handler = new ToasterUIActionHandler(this);

    constructor(props: ToasterUIPropsInterface) {

        super("toaster_ui", props);

        this.getComponentDefinition();

    }

    protected getUIComponents(): ToasterUIComponentsInterface {

        return {};

    }

    protected getUIStateData(): ToasterUIStateDataInterface {

        return {

            visible: !!(this.props.status && this.props.message)

        };

    }

    protected getUIWatchers(): WatchersType<ToasterUIPropsInterface, ToasterUIStateDataInterface> {
        return {
            status: () => { 
                this.state_refs.visible.value = !!(this.props.status && this.props.message)
            },
            message: () => { 
                this.state_refs.visible.value = !!(this.props.status && this.props.message)
            },
            duration: () => {
                this.action_handler.restartAutoClose();
            },
            visible: (new_val) => {
                this.action_handler.handleOnHide()
            }
        };
    }

}

export default ToasterUIController;
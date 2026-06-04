import BaseController from "../base_classes/base_controller";

import {
    ToasterUIPropsInterface,
    ToasterUIStateDataInterface,
    ToasterUIComputedDataInterface,
    ToasterUIComponentsInterface
} from "../ui_types/toaster_ui_type";

import ToasterUIActionHandler from "../action_handlers/toaster_ui_action_handler";
import { WatchersType } from "../types/base_type";

class ToasterUIController extends BaseController<
    ToasterUIPropsInterface,
    ToasterUIStateDataInterface,
    ToasterUIComputedDataInterface,
    ToasterUIComponentsInterface
> {
    public override action_handler: ToasterUIActionHandler;

    constructor(props: ToasterUIPropsInterface) {
        super("toaster_ui", props);

        this.action_handler = new ToasterUIActionHandler(this);
        this.setActionHandler(this.action_handler);

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
        const syncVisible = () => {
            this.state_refs.visible.value = !!(this.props.status && this.props.message);
            this.action_handler.restartAutoClose();
        };

        return {
            status: syncVisible,
            message: syncVisible,
            duration: () => {
                this.action_handler.restartAutoClose();
            },
            visible: (new_val) => {
                if (!new_val) {
                    this.action_handler.handleOnHide();
                }
            }
        };
    }
}

export default ToasterUIController;

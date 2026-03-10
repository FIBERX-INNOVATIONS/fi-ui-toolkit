import BaseController from "../base_classes/base_controller";

import {
    ToasterUIPropsInterface,
    ToasterUIStateDataInterface,
    ToasterUIComputedDataInterface,
    ToasterUIComponentsInterface
} from "../ui_types/toaster_ui_type";

import ToasterUIActionHandler from "../action_handlers/toaster_ui_action_handler";

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

            visible: !!this.props.message

        };

    }

    protected getUIComputedData() {

        return {

            is_visible: () => this.state_refs.visible.value

        };

    }

}

export default ToasterUIController;
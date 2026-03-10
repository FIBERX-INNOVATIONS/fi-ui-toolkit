
import BaseController  from "../base_classes/base_controller";

import ButtonUIActionHandler from "../action_handlers/button_ui_action_handler";

import { ComputedDefinitionType } from "../types/base_type";

import { 
    ButtonUIPropsInterface,
    ButtonUIStateDataInterface,
    ButtonUIComputedDataInterface,
    ButtonUIComponentsInterface,
} from "../ui_types/button_ui_type";

class ButtonUIController extends BaseController<
    ButtonUIPropsInterface,
    ButtonUIStateDataInterface,
    ButtonUIComputedDataInterface,
    ButtonUIComponentsInterface
> {

    public action_handler: ButtonUIActionHandler =
        new ButtonUIActionHandler(this);

    constructor(props: ButtonUIPropsInterface) {
        super("button_ui", props);
        this.getComponentDefinition();
    }

    protected getUIComponents(): ButtonUIComponentsInterface {
        return {};
    }

    protected getUIStateData(): ButtonUIStateDataInterface {

        return {

            is_loading: false

        };

    }

    protected getUIComputedData(): ComputedDefinitionType<ButtonUIComputedDataInterface> {

        return {

            is_disabled: (): boolean => {

                return (
                    this.props.boolean_props?.disabled ||
                    this.state_refs.is_loading.value
                );

            }

        };

    }

}

export default ButtonUIController;
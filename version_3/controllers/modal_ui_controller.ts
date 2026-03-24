import BaseController  from "../base_classes/base_controller";

import ModalUIActionHandler from "../action_handlers/modal_ui_action_handler";

import { ComputedDefinitionType } from "../types/base_type";

import { 
    ModalUIPropsInterface,
    ModalUIStateDataInterface,
    ModalUIComputedDataInterface,
    ModalUIComponentsInterface,
} from "../ui_types/modal_ui_type";

import OverlayUI from "../components/OverlayUI.vue";
import LayoutSectionsUI from "../components/LayoutSectionsUI.vue";


class ModalUIController extends BaseController<
    ModalUIPropsInterface,
    ModalUIStateDataInterface,
    ModalUIComputedDataInterface,
    ModalUIComponentsInterface
>{

    public action_handler: ModalUIActionHandler =
        new ModalUIActionHandler(this);

    constructor(props: ModalUIPropsInterface) {

        super("modal_ui", props);

        this.getComponentDefinition();

    }

    protected getUIComponents(): ModalUIComponentsInterface {

        return { LayoutSectionsUI, OverlayUI };

    }

    protected getUIStateData(): ModalUIStateDataInterface {

        return {
            is_visible: true
        };

    }

    protected getUIComputedData(): ComputedDefinitionType<ModalUIComputedDataInterface> {

        return {

            transition_name: () => {

                return `modal-${this.props.animation_type}`;

            },

            z_index_style: () => {

                return {

                    zIndex: `${100 + (this.props.layer ?? 1)}`

                };

            }

        };

    }

}

export default ModalUIController;
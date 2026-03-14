
import BaseController  from "../base_classes/base_controller";

import NavLinkUI from "../components/NavLinkUI.vue";

import { ComputedDefinitionType } from "../types/base_type";

import { 
    DropdownMenuUIPropsInterface,
    DropdownMenuUIStateDataInterface,
    DropdownMenuUIComputedDataInterface,
    DropdownMenuUIComponentsInterface,
} from "../ui_types/dropdown_menu_ui_type";

class DropdownMenuUIController extends BaseController<
    DropdownMenuUIPropsInterface,
    DropdownMenuUIStateDataInterface,
    DropdownMenuUIComputedDataInterface,
    DropdownMenuUIComponentsInterface
>{

    constructor(props: DropdownMenuUIPropsInterface) {

        super("dropdown_menu_ui", props);

        this.getComponentDefinition();

    }

    protected getUIComponents(): DropdownMenuUIComponentsInterface {

        return {
            NavLinkUI
        };

    }

    protected getUIStateData(): DropdownMenuUIStateDataInterface {

        return {

            is_open: false,

            position: "bottom",

            top: 0,

            left: 0

        };

    }

    protected getUIComputedData(): ComputedDefinitionType<DropdownMenuUIComputedDataInterface> {

        return {

            wrapper_style: () => {

                return {

                    top: `${this.state_refs.top}px`,

                    left: `${this.state_refs.left}px`

                };

            }

        };

    }

}

export default DropdownMenuUIController;


import BaseController from "../base_classes/base_controller";

import { 
    ButtonUIPropsInterface,
    ButtonUIStateDataInterface,
    ButtonUIComputedDataInterface,
    ButtonUIComponentsInterface,
} from "../ui_types/button_ui_type";

class ButtonUIActionHandler {

    private controller: BaseController<
        ButtonUIPropsInterface,
        ButtonUIStateDataInterface,
        ButtonUIComputedDataInterface,
        ButtonUIComponentsInterface
    >;

    constructor(
        controller: BaseController<
            ButtonUIPropsInterface,
            ButtonUIStateDataInterface,
            ButtonUIComputedDataInterface,
            ButtonUIComponentsInterface
        >
    ) {
        this.controller = controller;
    }

    public handleOnClick = async (event: MouseEvent): Promise<void> => {
        this.controller.state_refs.is_loading.value = true;
        try {
            const { props, state_refs } = this.controller;

            const { on_click } = props.action_props || {};

            if(!on_click || state_refs.is_loading.value) { 
                return 
            }

            await on_click(event, { props });
            return;
        }
        catch(error: any) {
            console.error(`[${this.controller.name}] handleOnClick error:`, error);
            return;
        }
        finally {
            this.controller.state_refs.is_loading.value = false;
        }
    }

    public handleOnHover = async (event: MouseEvent): Promise<void> => {

        const { props }     = this.controller;
        const { on_hover }  = props.action_props || {};

        if(!on_hover) { 
            return 
        }

        await on_hover?.(event, { props });

        return;

    }

}

export default ButtonUIActionHandler;
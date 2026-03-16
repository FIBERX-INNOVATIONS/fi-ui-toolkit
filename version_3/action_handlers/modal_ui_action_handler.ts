
import BaseController from "../base_classes/base_controller";

import { 
    ModalUIPropsInterface,
    ModalUIStateDataInterface,
    ModalUIComputedDataInterface,
    ModalUIComponentsInterface,
} from "../ui_types/modal_ui_type";

class ModalUIActionHandler {

    private controller: BaseController<
        ModalUIPropsInterface,
        ModalUIStateDataInterface,
        ModalUIComputedDataInterface,
        ModalUIComponentsInterface
    >;

    constructor(
        controller: BaseController<
            ModalUIPropsInterface,
            ModalUIStateDataInterface,
            ModalUIComputedDataInterface,
            ModalUIComponentsInterface
        >
    ) {
        this.controller = controller;
    }

    public async handleClose(event?: MouseEvent) {

        const { props } = this.controller;

        await props.action_props?.on_close?.(
            event,
            { props }
        );

    }

}

export default ModalUIActionHandler;

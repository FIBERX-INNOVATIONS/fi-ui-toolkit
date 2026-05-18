import BaseActionHandler from "../base_classes/base_action_handler";
import BaseController from "../base_classes/base_controller";

import {
    ModalUIComponentsInterface,
    ModalUIComputedDataInterface,
    ModalUIPropsInterface,
    ModalUIStateDataInterface
} from "../ui_types/modal_ui_type";

class ModalUIActionHandler extends BaseActionHandler<
    ModalUIPropsInterface,
    ModalUIStateDataInterface,
    ModalUIComputedDataInterface,
    ModalUIComponentsInterface
> {
    constructor(
        controller: BaseController<
            ModalUIPropsInterface,
            ModalUIStateDataInterface,
            ModalUIComputedDataInterface,
            ModalUIComponentsInterface
        >
    ) {
        super(controller);
    }

    public handleClose = async (event?: MouseEvent): Promise<void> => {
        const { on_close } = this.props.action_props || {};

        await this.invokeAction(on_close, event, { props: this.props });
    };
}

export default ModalUIActionHandler;

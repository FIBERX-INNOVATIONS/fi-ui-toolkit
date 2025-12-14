

import BaseEventHandler             from "../../base_classes/base_event_handler";
import { BaseControllerInterface }  from "../../types/component_type";


class ConfirmActionUIEventHandler extends BaseEventHandler {
    constructor(controller: BaseControllerInterface) {
        super(controller, controller.component_name);
    }

    public async handleCancelBtnClick (event: MouseEvent) {
        const { on_cancel_click }  = this.controller.props;

        if (!on_cancel_click) { return; }

        const result = on_cancel_click(event);

        if (result instanceof Promise) { await result; }
    }

    public async handleConfirmBtnClick (event: MouseEvent) {
        const { on_confirm_click }  = this.controller.props;

        if (!on_confirm_click) { return; }

        const result = on_confirm_click(event);

        if (result instanceof Promise) { await result; }
    }

}

export default ConfirmActionUIEventHandler;
import BaseActionHandler from "../base_classes/base_action_handler";
import BaseController from "../base_classes/base_controller";

import { StatusAlertUIPropsInterface } from "../ui_types/status_alert_ui_type";

class StatusAlertUIActionHandler extends BaseActionHandler<StatusAlertUIPropsInterface> {
    constructor(controller: BaseController<StatusAlertUIPropsInterface>) {
        super(controller);
    }

    public handleOnClick = async (event: MouseEvent): Promise<void> => {
        await this.invokeAction(this.props.on_close, event);
    };
}

export default StatusAlertUIActionHandler;

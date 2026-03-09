

import BaseController  from "../base_classes/base_controller";

import StatusAlertUIActionHandler from "../action_handlers/status_alert_ui_action_handler";

import { StatusAlertUIPropsInterface } from "../ui_types/status_alert_ui_type";

class StatusAlertUIController extends BaseController<
    StatusAlertUIPropsInterface
> {
    public action_handler: StatusAlertUIActionHandler = StatusAlertUIActionHandler.getInstance(this);

    constructor(props: StatusAlertUIPropsInterface) {
        super("status_alert_ui", props);

        this.getComponentDefinition();
    }

}

export default StatusAlertUIController;
import BaseController from "../base_classes/base_controller";

import StatusAlertUIActionHandler from "../action_handlers/status_alert_ui_action_handler";

import { StatusAlertUIPropsInterface } from "../ui_types/status_alert_ui_type";

class StatusAlertUIController extends BaseController<StatusAlertUIPropsInterface> {
    public override action_handler: StatusAlertUIActionHandler;

    constructor(props: StatusAlertUIPropsInterface) {
        super("status_alert_ui", props);

        this.action_handler = new StatusAlertUIActionHandler(this);
        this.setActionHandler(this.action_handler);

        this.getComponentDefinition();
    }
}

export default StatusAlertUIController;

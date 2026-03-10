import BaseController from "../base_classes/base_controller";
import LoggerUtil from "../utils/logger_util";
import { StatusAlertUIPropsInterface } from "../ui_types/status_alert_ui_type";

class StatusAlertUIActionHandler {
    public readonly name = "status_alert_ui_action_handler";

    // Singleton instance
    private static instance: StatusAlertUIActionHandler | null = null;

    // Make controller static so it’s shared across all usage
    private controller: BaseController<StatusAlertUIPropsInterface>;

    private readonly logger: LoggerUtil = new LoggerUtil({ prefix: this.name, show_timestamp: false });

    /** Private constructor */
    constructor(
        controller: BaseController<StatusAlertUIPropsInterface>
    ) {
        this.controller = controller;
    }

    /** Handle click event */
    public handleOnClick = (event: MouseEvent) => {
        const ctrl = this.controller;
        const { on_close } = ctrl.props;

        if (!on_close) return;

        on_close(event);
    };
}

export default StatusAlertUIActionHandler;
import BaseEventHandler             from "../../base_classes/base_event_handler";
import { BaseControllerInterface }  from "../../types/component_type";

class StatMetricCardUIEventHandler extends BaseEventHandler {
    constructor(controller: BaseControllerInterface) {
        super(controller, controller.component_name);
    }

    public handleTopLinkClick (event: MouseEvent) {
        const { props = {} } = this.controller;
        const { onTopLinkClick } = props;

        if (onTopLinkClick) {
            onTopLinkClick(event);
        }
    }
}

export default StatMetricCardUIEventHandler;

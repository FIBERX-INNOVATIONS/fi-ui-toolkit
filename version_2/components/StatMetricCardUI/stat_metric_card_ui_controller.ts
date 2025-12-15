import BaseController from "../../base_classes/base_controller";
import StatMetricCardUIEventHandler from "./stat_metric_card_ui_event_handler";

class StatMetricCardUIController extends BaseController {
    public event_handler: StatMetricCardUIEventHandler;

    constructor(props: Record<string, any> = {}) {
        super("stat_metric_card_ui", props);
        this.event_handler = new StatMetricCardUIEventHandler(this);
    }

    public get hasSecondaryMetric(): boolean {
        const { metric_value_2 } = this.props;
        return metric_value_2 !== null && metric_value_2 !== undefined && metric_value_2 !== "";
    }
    
}

export default StatMetricCardUIController;

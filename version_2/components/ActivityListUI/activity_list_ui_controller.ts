import { ref }                      from "vue";
import BaseController               from "../../base_classes/base_controller";
import ActivityListUIEventHandler   from "./activity_list_ui_event_handler"

class ActivityListUIController extends BaseController {
    public event_handler: ActivityListUIEventHandler

    constructor(props: Record<string, any> = {}) {
        super("activity_list_ui", props);

        this.event_handler = new ActivityListUIEventHandler(this);
    }

    // Method to get ui state data
        protected getUIStateData(): Record<string, any> { 
            return {
                is_loading: ref (false)
            } 
        }

}

export default ActivityListUIController;
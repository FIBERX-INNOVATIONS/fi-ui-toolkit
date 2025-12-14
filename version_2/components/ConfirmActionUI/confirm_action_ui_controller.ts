
import { ref }                      from "vue";
import ConfirmActionUIPorpsBuilder  from "./confirm_action_ui_props_builder";
import BaseController               from "../../base_classes/base_controller";
import ConfirmActionUIEventHandler  from "./confirm_action_ui_event_handler";
import ButtonUI                     from "../ButtonUI/button_ui.vue"

class ConfirmActionUIController extends BaseController {
    public event_handler: ConfirmActionUIEventHandler;

    constructor(props: Record<string, any> = {}) {
        super("confirm_action_ui", props);

        this.event_handler = new ConfirmActionUIEventHandler(this);
    }

    // Method to get ui components
    protected getUIComponents(): Record<string, any> { 
        return  { ButtonUI }; 
    }

    // Method to get ui state data
    protected getUIStateData(): Record<string, any> { 
        const { cancel_btn_content, confirm_btn_content } = this.props;
        return {
            cancel_btn_props: ConfirmActionUIPorpsBuilder.getCancelBtnProps(this.event_handler, cancel_btn_content),

            confirm_btn_props: ConfirmActionUIPorpsBuilder.getConfirmBtnProps(this.event_handler, confirm_btn_content),
        } 
    }

}

export default ConfirmActionUIController;
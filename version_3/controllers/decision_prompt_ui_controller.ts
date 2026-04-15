import BaseController from "../base_classes/base_controller";

import {
    DecisionPromptUIPropsInterface,
    DecisionPromptUIStateDataInterface,
    DecisionPromptUIComputedDataInterface,
    DecisionPromptUIComponentsInterface
} from "../ui_types/decision_prompt_ui_type";

import ButtonUI from "../components/ButtonUI.vue";

class DecisionPromptUIController extends BaseController<
    DecisionPromptUIPropsInterface,
    DecisionPromptUIStateDataInterface,
    DecisionPromptUIComputedDataInterface,
    DecisionPromptUIComponentsInterface
>{


    constructor(props: DecisionPromptUIPropsInterface) {
        super("decision_prompt_ui", props);
        this.getComponentDefinition();
    }

    protected getUIComponents(): DecisionPromptUIComponentsInterface {
        return {
            ButtonUI
        };
    }
}

export default DecisionPromptUIController;
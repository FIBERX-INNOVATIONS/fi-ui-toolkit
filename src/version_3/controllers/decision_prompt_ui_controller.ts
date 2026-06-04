import BaseController from "../base_classes/base_controller";

import DecisionPromptUIActionHandler from "../action_handlers/decision_prompt_ui_action_handler";

import { ComputedDefinitionType } from "../types/base_type";

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
> {
    constructor(props: DecisionPromptUIPropsInterface) {
        super("decision_prompt_ui", props);

        this.setActionHandler(new DecisionPromptUIActionHandler(this));

        this.getComponentDefinition();
    }

    protected getUIComponents(): DecisionPromptUIComponentsInterface {
        return {
            ButtonUI
        };
    }

    protected getUIStateData(): DecisionPromptUIStateDataInterface {
        return {
            is_confirming: false,
            is_canceling: false,
            error_text: null
        };
    }

    protected getUIComputedData(): ComputedDefinitionType<DecisionPromptUIComputedDataInterface> {
        return {
            is_processing: (): boolean => {
                return this.state_refs.is_confirming.value || this.state_refs.is_canceling.value;
            },

            confirm_button_disabled: (): boolean => {
                return this.computed_refs.is_processing.value;
            },

            cancel_button_disabled: (): boolean => {
                return this.computed_refs.is_processing.value;
            }
        };
    }
}

export default DecisionPromptUIController;

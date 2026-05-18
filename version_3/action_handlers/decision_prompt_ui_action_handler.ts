import BaseActionHandler from "../base_classes/base_action_handler";
import BaseController from "../base_classes/base_controller";

import {
    DecisionPromptUIComponentsInterface,
    DecisionPromptUIComputedDataInterface,
    DecisionPromptUIPropsInterface,
    DecisionPromptUIStateDataInterface
} from "../ui_types/decision_prompt_ui_type";

class DecisionPromptUIActionHandler extends BaseActionHandler<
    DecisionPromptUIPropsInterface,
    DecisionPromptUIStateDataInterface,
    DecisionPromptUIComputedDataInterface,
    DecisionPromptUIComponentsInterface
> {
    constructor(
        controller: BaseController<
            DecisionPromptUIPropsInterface,
            DecisionPromptUIStateDataInterface,
            DecisionPromptUIComputedDataInterface,
            DecisionPromptUIComponentsInterface
        >
    ) {
        super(controller);
    }

    public handleConfirm = async (): Promise<void> => {
        await this.runWithLoading("is_confirming", async () => {
            try {
                const { on_confirm } = this.props.action_props || {};
                await this.invokeAction(on_confirm);
                this.setState("error_text", null);
            } catch (error) {
                this.logError("handleConfirm", error);
                this.setState("error_text", "An error occurred during confirmation");
            }
        });
    };

    public handleCancel = async (): Promise<void> => {
        await this.runWithLoading("is_canceling", async () => {
            try {
                const { on_cancel } = this.props.action_props || {};
                await this.invokeAction(on_cancel);
                this.setState("error_text", null);
            } catch (error) {
                this.logError("handleCancel", error);
                this.setState("error_text", "An error occurred during cancellation");
            }
        });
    };

    public clearError = (): void => {
        this.setState("error_text", null);
    };
}

export default DecisionPromptUIActionHandler;

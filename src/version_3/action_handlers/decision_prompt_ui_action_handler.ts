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

    private getReasonText = (): string => {
        return this.state_refs.reason_text.value.trim();
    };

    public handleConfirm = async (event?: MouseEvent): Promise<void> => {
        if (this.props.boolean_props?.reason_required && !this.getReasonText()) {
            this.setState("error_text", "A reason is required");
            return;
        }

        await this.runWithLoading("is_confirming", async () => {
            try {
                const { on_confirm } = this.props.action_props || {};

                const button_result = await this.invokeAction(
                    this.props.confirm_button_props?.action_props?.on_click,
                    event,
                    { props: this.props.confirm_button_props ?? {} }
                );

                this.setErrorFromResult(button_result);

                if (button_result?.status === false) {
                    return;
                }

                const result = await this.invokeAction(on_confirm, this.getReasonText(), event, { props: this.props });

                this.setErrorFromResult(result);
                if (result?.status === false) {
                    return;
                }

                this.setState("error_text", null);
            } catch (error) {
                this.logError("handleConfirm", error);
                this.setState("error_text", "An error occurred during confirmation");
            }
        });
    };

    public handleCancel = async (event?: MouseEvent): Promise<void> => {
        await this.runWithLoading("is_canceling", async () => {
            try {
                const { on_cancel } = this.props.action_props || {};

                const button_result = await this.invokeAction(
                    this.props.cancel_button_props?.action_props?.on_click,
                    event,
                    {
                        props: this.props.cancel_button_props ?? {}
                    }
                );

                this.setErrorFromResult(button_result);

                if (button_result?.status === false) {
                    return;
                }

                const result = await this.invokeAction(on_cancel, event, { props: this.props });

                this.setErrorFromResult(result);
                if (result?.status === false) {
                    return;
                }

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

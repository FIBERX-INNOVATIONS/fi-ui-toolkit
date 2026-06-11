import BaseController from "../base_classes/base_controller";

import DecisionPromptUIActionHandler from "../action_handlers/decision_prompt_ui_action_handler";

import { ComputedDefinitionType } from "../types/base_type";

import {
    DecisionPromptUIPropsInterface,
    DecisionPromptUIStateDataInterface,
    DecisionPromptUIComputedDataInterface,
    DecisionPromptUIComponentsInterface
} from "../ui_types/decision_prompt_ui_type";
import { ButtonUIPropsInterface } from "../ui_types/button_ui_type";

import ButtonUI from "../components/ButtonUI.vue";

class DecisionPromptUIController extends BaseController<
    DecisionPromptUIPropsInterface,
    DecisionPromptUIStateDataInterface,
    DecisionPromptUIComputedDataInterface,
    DecisionPromptUIComponentsInterface
> {
    public override action_handler: DecisionPromptUIActionHandler;

    constructor(props: DecisionPromptUIPropsInterface) {
        super("decision_prompt_ui", props);

        this.action_handler = new DecisionPromptUIActionHandler(this);
        this.setActionHandler(this.action_handler);

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
            reason_text: "",
            error_text: null
        };
    }

    protected getUIComputedData(): ComputedDefinitionType<DecisionPromptUIComputedDataInterface> {
        return {
            is_processing: (): boolean => {
                return this.state_refs.is_confirming.value || this.state_refs.is_canceling.value;
            },

            show_reason_input: (): boolean => {
                return Boolean(
                    this.props.boolean_props?.show_reason_input || this.props.boolean_props?.reason_required
                );
            },

            confirm_button_disabled: (): boolean => {
                const reason_is_missing =
                    this.computed_refs.show_reason_input.value &&
                    Boolean(this.props.boolean_props?.reason_required) &&
                    this.state_refs.reason_text.value.trim().length === 0;

                return Boolean(
                    this.computed_refs.is_processing.value ||
                    this.props.confirm_button_props?.boolean_props?.disabled ||
                    reason_is_missing
                );
            },

            cancel_button_disabled: (): boolean => {
                return Boolean(
                    this.computed_refs.is_processing.value || this.props.cancel_button_props?.boolean_props?.disabled
                );
            },

            display_confirm_button_props: (): ButtonUIPropsInterface => {
                return this.getButtonPropsWithAction(
                    this.props.confirm_button_props,
                    this.computed_refs.confirm_button_disabled.value,
                    this.action_handler.handleConfirm
                );
            },

            display_cancel_button_props: (): ButtonUIPropsInterface => {
                return this.getButtonPropsWithAction(
                    this.props.cancel_button_props,
                    this.computed_refs.cancel_button_disabled.value,
                    this.action_handler.handleCancel
                );
            }
        };
    }

    private getButtonPropsWithAction(
        button_props: ButtonUIPropsInterface = {},
        disabled: boolean,
        on_click: (event?: MouseEvent) => Promise<void>
    ): ButtonUIPropsInterface {
        return {
            ...button_props,

            boolean_props: {
                ...button_props.boolean_props,
                disabled
            },

            action_props: {
                ...button_props.action_props,
                on_click
            }
        };
    }
}

export default DecisionPromptUIController;

import { markRaw } from "vue";

import type { ComputedDefinitionType } from "../types/base_type";

import { DepositFlowUISteps } from "../configs/deposit_flow_ui_config";

import type {
    DepositFlowUIPropsInterface,
    DepositFlowStateInterface,
    DepositFlowComputedInterface,
    DepositFlowComponentsInterface
} from "../ui_types/deposit_flow_ui_type";

import ButtonUI from "../components/ButtonUI.vue";

import RenderHtmlUtil from "../utils/render_html_util";

import BaseController from "../base_classes/base_controller";

import ButtonUIPropsBuilder from "../props_builder/button_ui_props_builder";

import DepositDetailsUI from "../components/DepositFlowUI/DepositDetailsUI.vue";

import PaymentStepUIPropsBuilder from "../props_builder/payment_step_ui_props_builder";

import PaymentOptionPickerUI from "../components/DepositFlowUI/PaymentOptionPickerUI.vue";

import DepositFlowUIActionHandler from "../action_handlers/deposit_flow_ui_action_handler";

import TransactionIntentReviewUI from "../components/DepositFlowUI/TransactionIntentReviewUI.vue";

class DepositFlowUIController extends BaseController<
    DepositFlowUIPropsInterface,
    DepositFlowStateInterface,
    DepositFlowComputedInterface,
    DepositFlowComponentsInterface
> {
    public override action_handler: DepositFlowUIActionHandler;

    // Method to attach the deposit coordinator before initializing reactive state.
    constructor(props: DepositFlowUIPropsInterface) {
        super("deposit_flow_ui", props);
        this.action_handler = new DepositFlowUIActionHandler(this);
        this.setActionHandler(this.action_handler);
    }

    // Method to expose independently reusable deposit views.
    protected getUIComponents(): DepositFlowComponentsInterface {
        return {
            ButtonUI: markRaw(ButtonUI),
            DepositDetailsUI: markRaw(DepositDetailsUI),
            PaymentOptionPickerUI: markRaw(PaymentOptionPickerUI),
            TransactionIntentReviewUI: markRaw(TransactionIntentReviewUI)
        };
    }

    // Method to seed a flow with a stable idempotency reference.
    protected getUIStateData(): DepositFlowStateInterface {
        return {
            step: "details",
            currencies: [],
            details: { ...this.props.initial_values },
            providers: [],
            methods: [],
            provider_id: "",
            method_id: "",
            intent: null,
            is_loading: false,
            is_ready: false,
            error_text: "",
            cache: { version: 1, request_key: crypto.randomUUID(), accounts: {} }
        };
    }

    // Method to configure each step using host content, styles, and callbacks.
    protected getUIComputedData(): ComputedDefinitionType<DepositFlowComputedInterface> {
        return {
            retry_button: () => {
                return ButtonUIPropsBuilder.getReactivePropsObject(`${this.props.id}_retry`, "", undefined, "button", {
                    content_props: {
                        button_html_content: RenderHtmlUtil.escapeHtml(this.props.content_props.retry_text)
                    },
                    class_styles: this.props.class_styles.button,
                    boolean_props: { disabled: this.state_refs.is_loading.value },
                    action_props: { on_click: this.action_handler.initialize }
                });
            },

            step_props: () => {
                const state = this.state_refs;
                const step = state.step.value;

                return PaymentStepUIPropsBuilder.getReactivePropsObject(`${this.props.id}_${step}`, {
                    currencies: state.currencies.value,
                    initial_values: state.details.value,
                    description_required: this.props.description_required,
                    readonly_fields: this.props.readonly_fields,
                    options: step === DepositFlowUISteps.PROVIDER_STEP ? state.providers.value : state.methods.value,
                    selected_id:
                        step === DepositFlowUISteps.PROVIDER_STEP ? state.provider_id.value : state.method_id.value,
                    intent: state.intent.value,
                    is_loading: state.is_loading.value,
                    class_styles: this.props.class_styles,
                    content_props: {
                        ...this.props.content_props,
                        title_text: this.props.content_props[`${step}_title_text`],
                        subtitle_text:
                            this.props.content_props[`${step}_subtitle_text`] ?? this.props.content_props.subtitle_text
                    },
                    action_props: {
                        on_details: this.action_handler.submitDetails,
                        on_select:
                            step === DepositFlowUISteps.PROVIDER_STEP
                                ? this.action_handler.selectProvider
                                : this.action_handler.selectMethod,
                        on_back: step === DepositFlowUISteps.DETAILS_STEP ? undefined : this.action_handler.back
                    }
                });
            }
        };
    }

    // Method to restore the deposit cache and currency catalogue at mount.
    protected async handleOnMountedLogic(): Promise<void> {
        await this.action_handler.initialize();
    }

    // Method to detach asynchronous navigation at unmount.
    protected async handleBeforeUnmountedLogic(): Promise<void> {
        this.action_handler.cleanup();
    }
}
export default DepositFlowUIController;

import { markRaw } from "vue";

import type { ComputedDefinitionType } from "../types/base_type";

import type { ButtonUIPropsInterface } from "../ui_types/button_ui_type";

import type {
    PaymentCheckoutUIPropsInterface,
    PaymentCheckoutStateInterface,
    PaymentCheckoutComputedInterface,
    PaymentCheckoutComponentsInterface
} from "../ui_types/payment_checkout_ui_type";

import ButtonUI from "../components/ButtonUI.vue";

import RenderHtmlUtil from "../utils/render_html_util";

import DecimalAmountUtil from "../utils/decimal_amount_util";

import BaseController from "../base_classes/base_controller";

import PaymentCheckoutUtil from "../utils/payment_checkout_util";

import InputTransformerUtil from "../utils/input_transformer_util";

import ButtonUIPropsBuilder from "../props_builder/button_ui_props_builder";

import PaymentCheckoutUIActionHandler from "../action_handlers/payment_checkout_ui_action_handler";

class PaymentCheckoutUIController extends BaseController<
    PaymentCheckoutUIPropsInterface,
    PaymentCheckoutStateInterface,
    PaymentCheckoutComputedInterface,
    PaymentCheckoutComponentsInterface
> {
    public override action_handler: PaymentCheckoutUIActionHandler;

    // Method to connect standalone checkout presentation and interaction handling.
    constructor(props: PaymentCheckoutUIPropsInterface) {
        super("payment_checkout_ui", props);

        this.action_handler = new PaymentCheckoutUIActionHandler(this);

        this.setActionHandler(this.action_handler);
    }

    // Method to reuse the shared button component for checkout actions.
    protected getUIComponents(): PaymentCheckoutComponentsInterface {
        return { ButtonUI: markRaw(ButtonUI) };
    }

    // Method to keep provider presentation state in memory only.
    protected getUIStateData(): PaymentCheckoutStateInterface {
        return { now: Date.now(), iframe_url: "", started_transaction_id: "", is_launching: false, error_text: "" };
    }

    // Method to construct a consistently styled and guarded checkout action.
    private getButton(
        key: "open_checkout_text" | "refresh_text" | "new_deposit_text",
        action: () => void | Promise<void>
    ): ButtonUIPropsInterface {
        const button_html_content = RenderHtmlUtil.escapeHtml(this.props.content_props[key]);

        return ButtonUIPropsBuilder.getReactivePropsObject(`${this.props.id}_${key}`, "", undefined, "button", {
            content_props: { button_html_content },

            class_styles: this.props.class_styles.button,

            boolean_props: { disabled: this.props.is_loading || this.state_refs.is_launching.value },

            action_props: {
                on_click: async () => {
                    await action();
                }
            }
        });
    }

    // Method to render instructions and status only from the authoritative transaction.
    protected getUIComputedData(): ComputedDefinitionType<PaymentCheckoutComputedInterface> {
        return {
            message_text: () => {
                const content = this.props.content_props;

                const transaction = this.props.transaction;

                if (transaction && transaction.outcome !== "pending") {
                    return content[`${transaction.outcome}_text`];
                }

                const action = PaymentCheckoutUtil.getAction(transaction, this.state_refs.now.value);

                if (action.type === "pending") {
                    return action.reason === "instructions_expired"
                        ? content.expired_instructions_text
                        : action.reason === "payment_review_required"
                          ? content.review_text
                          : content.pending_text;
                }

                if (action.type === "redirect") {
                    return PaymentCheckoutUtil.getCheckoutLink(action, this.props.config)
                        ? content.redirect_text
                        : content.unsupported_text;
                }

                if (action.type === "bank_transfer" || action.type === "wallet_transfer") {
                    return content[`${action.type}_text`];
                }

                return action.type === "none" ? content.no_action_text : content.unsupported_text;
            },

            rows: () => {
                const content = this.props.content_props;

                const transaction = this.props.transaction;

                if (!transaction) {
                    return [];
                }

                const rows = [
                    {
                        label_text: content.reference_text,
                        value_text: transaction.transaction_reference ?? transaction.public_id
                    }
                ];

                const action = PaymentCheckoutUtil.getAction(transaction, this.state_refs.now.value);

                if (action.type === "bank_transfer" || action.type === "wallet_transfer") {
                    rows.push({
                        label_text: content.amount_text,
                        value_text: `${DecimalAmountUtil.group(action.amount)} ${action.currency_code}`
                    });

                    const fields =
                        action.type === "bank_transfer"
                            ? (["account_number", "account_name", "bank_name", "bank_code", "expires_at"] as const)
                            : (["wallet_address", "network", "memo"] as const);

                    for (const field of fields) {
                        const value =
                            field in action ? (action as unknown as Record<string, unknown>)[field] : undefined;

                        if (typeof value === "string" && value) {
                            rows.push({
                                label_text: content[`${field}_text`],
                                value_text:
                                    field === "expires_at" ? InputTransformerUtil.formatReadableDateTime(value) : value
                            });
                        }
                    }
                }
                return rows;
            },

            checkout_link: () => {
                return PaymentCheckoutUtil.getCheckoutLink(
                    PaymentCheckoutUtil.getAction(this.props.transaction, this.state_refs.now.value),
                    this.props.config
                );
            },

            can_launch: () => {
                return (
                    this.props.config.mode !== "new_tab" &&
                    !!PaymentCheckoutUtil.getCheckoutLink(
                        PaymentCheckoutUtil.getAction(this.props.transaction, this.state_refs.now.value),
                        this.props.config
                    )
                );
            },

            can_refresh: () => {
                return (
                    !!this.props.action_props.on_refresh &&
                    PaymentCheckoutUtil.canRefresh(this.props.transaction, this.state_refs.started_transaction_id.value)
                );
            },

            can_start_new: () => {
                return !!this.props.transaction && PaymentCheckoutUtil.isTerminal(this.props.transaction);
            },

            launch_button: () => {
                return this.getButton("open_checkout_text", this.action_handler.launch);
            },

            refresh_button: () => {
                return this.getButton("refresh_text", this.action_handler.refresh);
            },

            new_deposit_button: () => {
                return this.getButton("new_deposit_text", this.action_handler.startNew);
            }
        };
    }

    // Method to begin expiry tracking after the component mounts.
    protected async handleOnMountedLogic(): Promise<void> {
        this.action_handler.initialize();
    }

    // Method to release timers and detach provider callbacks when checkout closes.
    protected async handleBeforeUnmountedLogic(): Promise<void> {
        this.action_handler.cleanup();
    }
}

export default PaymentCheckoutUIController;

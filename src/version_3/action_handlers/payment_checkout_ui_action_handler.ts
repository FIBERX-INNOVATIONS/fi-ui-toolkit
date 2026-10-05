import type {
    PaymentCheckoutUIPropsInterface,
    PaymentCheckoutStateInterface,
    PaymentCheckoutComputedInterface,
    PaymentCheckoutComponentsInterface
} from "../ui_types/payment_checkout_ui_type";

import PaymentCheckoutUtil from "../utils/payment_checkout_util";

import BaseActionHandler from "../base_classes/base_action_handler";

class PaymentCheckoutUIActionHandler extends BaseActionHandler<
    PaymentCheckoutUIPropsInterface,
    PaymentCheckoutStateInterface,
    PaymentCheckoutComputedInterface,
    PaymentCheckoutComponentsInterface
> {
    private expiry_timer: ReturnType<typeof setInterval> | undefined;
    private is_disposed = false;

    // Method to expire visible transfer instructions while the checkout remains open.
    public initialize(): void {
        this.expiry_timer = setInterval(() => {
            this.setState("now", Date.now());
        }, 1000);
    }

    // Method to record explicit hosted checkout navigation without treating it as payment confirmation.
    public markCheckoutStarted = (): void => {
        const transaction = this.props.transaction;
        if (
            !this.is_disposed &&
            !this.props.is_loading &&
            transaction &&
            PaymentCheckoutUtil.getCheckoutLink(
                PaymentCheckoutUtil.getAction(transaction, Date.now()),
                this.props.config
            )
        ) {
            this.setState("started_transaction_id", transaction.public_id);
        }
    };

    // Method to launch the already initialized payment using the host's preferred presentation.
    public launch = async (): Promise<void> => {
        if (this.props.is_loading || this.state_refs.is_launching.value || this.is_disposed) {
            return;
        }

        const transaction = this.props.transaction;

        const action = PaymentCheckoutUtil.getAction(transaction, Date.now());

        const url = PaymentCheckoutUtil.getCheckoutLink(action, this.props.config);

        if (!transaction || action.type !== "redirect" || !url) {
            return;
        }

        this.setState("error_text", "");
        this.setState("is_launching", true);

        try {
            const config = this.props.config;

            if (config.mode === "iframe") {
                // Frames require explicit host opt-in; hosted links remain available as a fallback.
                if (!config.iframe_origins.includes(new URL(url).origin)) {
                    throw new Error("Checkout frame origin is not enabled");
                }
                this.setState("iframe_url", url);
                this.markCheckoutStarted();
            } else if (config.mode === "sdk") {
                if (!config.launch_sdk) {
                    throw new Error("Missing provider SDK launcher");
                }

                await config.launch_sdk(action, transaction);
                this.markCheckoutStarted();
                // A popup callback never proves payment; ask the host backend for the latest state.

                if (!this.is_disposed) {
                    await this.props.action_props.on_refresh?.();
                }
            } else if (config.mode === "redirect") {
                window.location.assign(url);
                this.markCheckoutStarted();
            }
        } catch {
            if (!this.is_disposed) {
                this.setState("error_text", this.props.content_props.launch_error_text);
            }
        } finally {
            if (!this.is_disposed) {
                this.setState("is_launching", false);
            }
        }
    };

    // Method to request verified backend state without reinitiating the payment.
    public refresh = async (): Promise<void> => {
        if (
            this.props.is_loading ||
            this.state_refs.is_launching.value ||
            this.is_disposed ||
            !PaymentCheckoutUtil.canRefresh(this.props.transaction, this.state_refs.started_transaction_id.value)
        ) {
            return;
        }

        this.setState("error_text", "");
        this.setState("is_launching", true);

        try {
            await this.props.action_props.on_refresh?.();
        } catch {
            if (!this.is_disposed) {
                this.setState("error_text", this.props.content_props.launch_error_text);
            }
        } finally {
            if (!this.is_disposed) {
                this.setState("is_launching", false);
            }
        }
    };

    // Method to reset only a terminal transaction after an explicit user action.
    public startNew = (): void => {
        if (
            !this.is_disposed &&
            !this.props.is_loading &&
            !this.state_refs.is_launching.value &&
            this.props.transaction &&
            PaymentCheckoutUtil.isTerminal(this.props.transaction)
        ) {
            this.props.action_props.on_new_deposit?.();
        }
    };

    // Method to stop expiry updates and ignore a provider callback after unmount.
    public cleanup(): void {
        this.is_disposed = true;
        clearInterval(this.expiry_timer);
    }
}

export default PaymentCheckoutUIActionHandler;

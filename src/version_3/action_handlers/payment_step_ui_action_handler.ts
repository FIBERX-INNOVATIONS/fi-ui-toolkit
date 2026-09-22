import type { InputValue, ActionMethodRetrunInterface } from "../ui_types/input_ui_type";

import type {
    PaymentStepUIPropsInterface,
    PaymentStepStateInterface,
    PaymentStepComputedInterface,
    PaymentStepComponentsInterface
} from "../ui_types/payment_step_ui_type";

import DecimalAmountUtil from "../utils/decimal_amount_util";

import BaseActionHandler from "../base_classes/base_action_handler";

class PaymentStepUIActionHandler extends BaseActionHandler<
    PaymentStepUIPropsInterface,
    PaymentStepStateInterface,
    PaymentStepComputedInterface,
    PaymentStepComponentsInterface
> {
    // Method to guard standalone callbacks against duplicate submissions and rejected promises.
    private async submit(action: () => Promise<void>): Promise<void> {
        this.setState("is_submitting", true);

        try {
            await action();
        } catch {
            this.setState("error_text", this.props.content_props.request_error_text);
        } finally {
            this.setState("is_submitting", true);
        }
    }

    // Method to commit input state while preserving exact amount digits.
    public change = async (
        field: "currency_code" | "amount" | "description",
        value?: InputValue
    ): Promise<ActionMethodRetrunInterface> => {
        this.setState("error_text", "");

        if (field === "amount") {
            this.formatAmount(value as string);
        } else {
            this.setState(field, String(value ?? ""));
        }

        return { status: true, msg: "" };
    };

    // Method to group a valid entered amount when the field loses focus.
    public formatAmount = (amount?: string): void => {
        const currency = this.props.currencies.find((item) => {
            return item.code === this.state_refs.currency_code.value;
        });

        const raw_amount = amount ?? this.state_refs.amount.value;

        // Remove existing grouping commas before converting to number.
        const numeric_amount = Number(String(raw_amount).replace(/,/g, ""));

        // Generate error text
        const error_text = this.props.content_props.invalid_amount_input_text
            .replace("{{currency_code}}", currency?.code ?? "")
            .replace("{{precision}}", String(currency?.precision));

        // Don't try to format an invalid value.
        if (Number.isNaN(numeric_amount)) {
            this.setState("error_text", error_text);
            return;
        }

        const normalized = DecimalAmountUtil.normalize(String(numeric_amount), currency?.precision ?? 0);

        if (normalized === null) {
            this.setState("error_text", error_text);
            return;
        }

        const formatted_amount = DecimalAmountUtil.group(normalized);

        this.setState("amount", formatted_amount);
        return;
    };

    // Method to format amount when input is out of focus
    public formatAmountOnOutOfFocus = (): void => {
        return this.formatAmount();
    };

    // Method to validate the three details before advancing.
    public submitDetails = async (): Promise<void> => {
        if (this.props.is_loading || this.state_refs.is_submitting.value) {
            return;
        }

        const currency = this.props.currencies.find((item) => {
            return item.code === this.state_refs.currency_code.value;
        });

        const amount = DecimalAmountUtil.normalize(this.state_refs.amount.value, currency?.precision ?? -1);

        const description = this.state_refs.description.value.trim();

        if (!currency || !amount || (this.props.description_required && !description)) {
            this.setState("error_text", this.props.content_props.invalid_text);
            return;
        }

        await this.submit(async () => {
            await this.props.action_props.on_details?.({ currency_code: currency.code, amount, description });
        });
    };

    // Method to select a payment option through native radio interaction.
    public select = (event: Event): void => {
        if (!this.props.is_loading && event.target instanceof HTMLInputElement) {
            this.setState("selected_id", event.target.value);
            this.setState("error_text", "");
        }
    };

    // Method to advance only with a currently available option.
    public submitSelection = async (): Promise<void> => {
        if (this.props.is_loading || this.state_refs.is_submitting.value) {
            return;
        }
        if (
            !this.props.options.some((option) => {
                return option.id === this.state_refs.selected_id.value;
            })
        ) {
            this.setState("error_text", this.props.content_props.selection_required_text);
            return;
        }
        await this.submit(async () => {
            await this.props.action_props.on_select?.(this.state_refs.selected_id.value);
        });
    };

    // Method to return to the preceding step when no request is running.
    public back = (): void => {
        if (!(this.props.is_loading || this.state_refs.is_submitting.value)) {
            this.props.action_props.on_back?.();
        }
    };
}
export default PaymentStepUIActionHandler;

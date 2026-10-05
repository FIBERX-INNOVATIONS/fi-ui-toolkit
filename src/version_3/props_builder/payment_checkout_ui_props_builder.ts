import BasePropSchema from "../base_classes/base_prop_schema";
import PaymentCheckoutUIClassStyles from "../class_styles/payment_checkout_ui_class_styles";
import type { PaymentCheckoutUIPropsInterface } from "../ui_types/payment_checkout_ui_type";

class PaymentCheckoutUIPropsBuilder extends BasePropSchema<PaymentCheckoutUIPropsInterface> {
    public static readonly static_prop_keys = ["id", "config", "class_styles", "action_props"];

    // Method to supply independent checkout defaults without application-specific copy.
    public static getDefaults(): PaymentCheckoutUIPropsInterface {
        return {
            id: "",
            transaction: null,
            is_loading: false,
            config: { mode: "new_tab", allowed_origins: [], iframe_origins: [] },
            content_props: {
                title_text: "",
                subtitle_text: "",
                open_checkout_text: "",
                open_tab_text: "",
                refresh_text: "",
                new_deposit_text: "",
                reference_text: "",
                amount_text: "",
                account_number_text: "",
                account_name_text: "",
                bank_name_text: "",
                bank_code_text: "",
                wallet_address_text: "",
                network_text: "",
                memo_text: "",
                expires_at_text: "",
                redirect_text: "",
                bank_transfer_text: "",
                wallet_transfer_text: "",
                pending_text: "",
                review_text: "",
                expired_instructions_text: "",
                unsupported_text: "",
                no_action_text: "",
                success_text: "",
                failed_text: "",
                cancelled_text: "",
                expired_text: "",
                launch_error_text: "",
                frame_note_text: "",
                iframe_title_text: ""
            },
            class_styles: PaymentCheckoutUIClassStyles,
            action_props: {}
        };
    }

    // Method to configure a checkout view using host adapters, labels, and styles.
    public static getReactivePropsObject(
        id: string,
        overrides: Partial<PaymentCheckoutUIPropsInterface> = {}
    ): PaymentCheckoutUIPropsInterface {
        const defaults = this.getDefaults();

        return this.createReactiveProps<PaymentCheckoutUIPropsInterface>({
            ...defaults,
            ...overrides,
            id,
            config: { ...defaults.config, ...overrides.config },
            content_props: { ...defaults.content_props, ...overrides.content_props },
            class_styles: { ...defaults.class_styles, ...overrides.class_styles }
        });
    }
}

export default PaymentCheckoutUIPropsBuilder;

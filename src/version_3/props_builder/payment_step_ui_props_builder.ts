import BasePropSchema from "../base_classes/base_prop_schema";
import PaymentStepUIClassStyles from "../class_styles/payment_step_ui_class_styles";
import type { PaymentStepUIPropsInterface } from "../ui_types/payment_step_ui_type";
class PaymentStepUIPropsBuilder extends BasePropSchema<PaymentStepUIPropsInterface> {
    public static readonly static_prop_keys = ["id", "action_props", "class_styles"];
    // Method to provide a fresh set of standalone payment-step defaults.
    public static getDefaults(): PaymentStepUIPropsInterface {
        return {
            id: "",
            content_props: {
                title_text: "",
                subtitle_text: "",
                currency_label_text: "",
                amount_label_text: "",
                description_label_text: "",
                next_btn_text: "",
                back_btn_text: "",
                empty_text: "",
                invalid_text: "",
                invalid_amount_input_text: "",
                fee_label_text: "",
                net_label_text: "",
                reference_label_text: "",
                review_note_text: "",
                search_text: "",
                selection_required_text: "",
                request_error_text: ""
            },
            class_styles: PaymentStepUIClassStyles,
            currencies: [],
            initial_values: { currency_code: "", amount: "", description: "" },
            description_required: false,
            readonly_fields: [],
            options: [],
            selected_id: "",
            intent: null,
            is_loading: false,
            action_props: {}
        };
    }
    // Method to build any standalone step with application-provided content and styles.
    public static getReactivePropsObject(
        id: string,
        overrides: Partial<PaymentStepUIPropsInterface> = {}
    ): PaymentStepUIPropsInterface {
        const defaults = this.getDefaults();
        return this.createReactiveProps<PaymentStepUIPropsInterface>({
            ...defaults,
            ...overrides,
            id,
            content_props: { ...defaults.content_props, ...overrides.content_props },
            class_styles: { ...defaults.class_styles, ...overrides.class_styles }
        });
    }
}
export default PaymentStepUIPropsBuilder;

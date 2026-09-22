import type { PropType } from "vue";

import type { PaymentStepUIPropsInterface } from "../ui_types/payment_step_ui_type";

import PaymentStepUIPropsBuilder from "../props_builder/payment_step_ui_props_builder";

const defaults = PaymentStepUIPropsBuilder.getDefaults();

const PaymentStepUIProps = {
    id: { type: String, required: true as const },

    content_props: {
        type: Object as PropType<PaymentStepUIPropsInterface["content_props"]>,
        default: () => {
            return { ...defaults.content_props };
        }
    },

    class_styles: {
        type: Object as PropType<PaymentStepUIPropsInterface["class_styles"]>,
        default: () => {
            return { ...defaults.class_styles };
        }
    },

    currencies: {
        type: Array as PropType<PaymentStepUIPropsInterface["currencies"]>,
        default: () => {
            return [];
        }
    },

    initial_values: {
        type: Object as PropType<PaymentStepUIPropsInterface["initial_values"]>,
        default: () => {
            return { currency_code: "", amount: "", description: "" };
        }
    },

    description_required: { type: Boolean, default: false },

    readonly_fields: {
        type: Array as PropType<PaymentStepUIPropsInterface["readonly_fields"]>,
        default: () => {
            return [];
        }
    },

    options: {
        type: Array as PropType<PaymentStepUIPropsInterface["options"]>,
        default: () => {
            return [];
        }
    },

    selected_id: { type: String, default: "" },

    intent: { type: Object as PropType<PaymentStepUIPropsInterface["intent"]>, default: null },

    is_loading: { type: Boolean, default: false },

    action_props: {
        type: Object as PropType<PaymentStepUIPropsInterface["action_props"]>,
        default: () => {
            return {};
        }
    }
} satisfies Record<keyof PaymentStepUIPropsInterface, unknown>;

export default PaymentStepUIProps;

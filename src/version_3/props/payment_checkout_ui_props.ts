import type { PropType } from "vue";

import type { PaymentCheckoutUIPropsInterface } from "../ui_types/payment_checkout_ui_type";

import PaymentCheckoutUIPropsBuilder from "../props_builder/payment_checkout_ui_props_builder";

const defaults = PaymentCheckoutUIPropsBuilder.getDefaults();

const PaymentCheckoutUIProps = {
    id: { type: String, required: true as const },

    transaction: { type: Object as PropType<PaymentCheckoutUIPropsInterface["transaction"]>, default: null },

    is_loading: { type: Boolean, default: false },

    config: {
        type: Object as PropType<PaymentCheckoutUIPropsInterface["config"]>,
        default: () => {
            return defaults.config;
        }
    },

    content_props: {
        type: Object as PropType<PaymentCheckoutUIPropsInterface["content_props"]>,
        default: () => {
            return defaults.content_props;
        }
    },

    class_styles: {
        type: Object as PropType<PaymentCheckoutUIPropsInterface["class_styles"]>,
        default: () => {
            return defaults.class_styles;
        }
    },
    action_props: {
        type: Object as PropType<PaymentCheckoutUIPropsInterface["action_props"]>,
        default: () => {
            return {};
        }
    }
} satisfies Record<keyof PaymentCheckoutUIPropsInterface, unknown>;

export default PaymentCheckoutUIProps;

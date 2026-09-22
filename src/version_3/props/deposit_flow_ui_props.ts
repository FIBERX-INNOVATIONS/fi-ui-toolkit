import type { PropType } from "vue";

import PaymentStepUIProps from "./payment_step_ui_props";

import type { DepositFlowUIPropsInterface } from "../ui_types/deposit_flow_ui_type";

import DepositFlowUIPropsBuilder from "../props_builder/deposit_flow_ui_props_builder";

const DepositFlowUIProps = {
    id: PaymentStepUIProps.id,

    currencies: PaymentStepUIProps.currencies,

    initial_values: PaymentStepUIProps.initial_values,

    description_required: PaymentStepUIProps.description_required,

    readonly_fields: PaymentStepUIProps.readonly_fields,

    class_styles: PaymentStepUIProps.class_styles,

    content_props: {
        type: Object as PropType<DepositFlowUIPropsInterface["content_props"]>,
        default: () => {
            return DepositFlowUIPropsBuilder.getContentDefaults();
        }
    },

    action_props: {
        type: Object as PropType<DepositFlowUIPropsInterface["action_props"]>,
        required: true as const
    },

    storage: {
        type: Object as PropType<DepositFlowUIPropsInterface["storage"]>,
        required: true as const
    }
} satisfies Record<keyof DepositFlowUIPropsInterface, unknown>;

export default DepositFlowUIProps;

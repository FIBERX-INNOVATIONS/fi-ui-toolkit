import BasePropSchema from "../base_classes/base_prop_schema";

import PaymentStepUIPropsBuilder from "./payment_step_ui_props_builder";

import type { DepositFlowUIPropsInterface, DepositFlowContentInterface } from "../ui_types/deposit_flow_ui_type";

class DepositFlowUIPropsBuilder extends BasePropSchema<DepositFlowUIPropsInterface> {
    public static readonly static_prop_keys = ["id", "action_props", "storage", "class_styles"];

    // Method to provide blank localized flow copy for application overrides.
    public static getContentDefaults(): DepositFlowContentInterface {
        return {
            ...PaymentStepUIPropsBuilder.getDefaults().content_props,
            details_title_text: "",
            provider_title_text: "",
            method_title_text: "",
            review_title_text: "",
            loading_text: "",
            retry_text: "",
            request_error_text: "",
            storage_error_text: "",
            update_unavailable_text: "",
            provisioning_unavailable_text: ""
        };
    }

    // Method to require explicit API and persistence adapters for a reusable flow.
    public static getReactivePropsObject(
        id: string,
        adapters: Pick<DepositFlowUIPropsInterface, "action_props" | "storage">,
        overrides: Partial<DepositFlowUIPropsInterface> = {}
    ): DepositFlowUIPropsInterface {
        const defaults = PaymentStepUIPropsBuilder.getDefaults();
        return this.createReactiveProps<DepositFlowUIPropsInterface>({
            ...defaults,
            ...overrides,
            ...adapters,
            id,
            content_props: { ...this.getContentDefaults(), ...overrides.content_props },
            class_styles: { ...defaults.class_styles, ...overrides.class_styles }
        });
    }
}
export default DepositFlowUIPropsBuilder;

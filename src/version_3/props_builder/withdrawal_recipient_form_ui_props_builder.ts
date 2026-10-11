import BasePropSchema from "../base_classes/base_prop_schema";
import Styles from "../class_styles/withdrawal_recipient_form_ui_class_styles";
import { RECIPIENT_RENDERING_SCHEMA } from "../configs/withdrawal_recipient_form_config";
import type { RecipientFormUIPropsInterface } from "../ui_types/withdrawal_recipient_form_ui_type";
class WithdrawalRecipientFormUIPropsBuilder extends BasePropSchema<RecipientFormUIPropsInterface> {
    public static readonly static_prop_keys = ["id", "class_styles", "action_props"];
    // Method to provide fresh standalone recipient form defaults.
    public static getDefaults(): RecipientFormUIPropsInterface {
        return {
            id: "RecipientForm",
            mode: "create",
            currencies: [],
            rendering_schema: structuredClone(RECIPIENT_RENDERING_SCHEMA),
            initial_values: {},
            stored_fields: [],
            saved_destination_text: "",
            readonly_fields: [],
            content_props: {},
            class_styles: Styles,
            action_props: {}
        };
    }
    // Method to combine host callbacks and presentation with reusable defaults.
    public static getReactivePropsObject(
        id: string,
        overrides: Partial<RecipientFormUIPropsInterface> = {}
    ): RecipientFormUIPropsInterface {
        return this.createReactiveProps<RecipientFormUIPropsInterface>({ ...this.getDefaults(), ...overrides, id });
    }
}
export default WithdrawalRecipientFormUIPropsBuilder;

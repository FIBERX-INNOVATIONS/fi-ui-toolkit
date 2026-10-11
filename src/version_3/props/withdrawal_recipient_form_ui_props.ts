import type { PropType } from "vue";
import type { RecipientFormUIPropsInterface as Props } from "../ui_types/withdrawal_recipient_form_ui_type";
import Builder from "../props_builder/withdrawal_recipient_form_ui_props_builder";
const props = {
    id: { type: String, default: "RecipientForm" },
    mode: { type: String as PropType<Props["mode"]>, default: "create" },
    currencies: {
        type: Array as PropType<Props["currencies"]>,
        default: () => {
            return [];
        }
    },
    rendering_schema: {
        type: Object as PropType<Props["rendering_schema"]>,
        default: () => {
            return Builder.getDefaults().rendering_schema;
        }
    },
    initial_values: {
        type: Object as PropType<Props["initial_values"]>,
        default: () => {
            return {};
        }
    },
    stored_fields: {
        type: Array as PropType<Props["stored_fields"]>,
        default: () => {
            return [];
        }
    },
    readonly_fields: {
        type: Array as PropType<Props["readonly_fields"]>,
        default: () => {
            return [];
        }
    },
    saved_destination_text: { type: String, default: "" },
    content_props: {
        type: Object as PropType<Props["content_props"]>,
        default: () => {
            return {};
        }
    },
    class_styles: {
        type: Object as PropType<Props["class_styles"]>,
        default: () => {
            return Builder.getDefaults().class_styles;
        }
    },
    action_props: {
        type: Object as PropType<Props["action_props"]>,
        default: () => {
            return {};
        }
    }
} satisfies Record<keyof Props, unknown>;
export default props;

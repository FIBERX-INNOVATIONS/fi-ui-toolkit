import { markRaw } from "vue";

import { SVGIcons } from "../resources/svg_icon_resource";

import type { ComputedDefinitionType } from "../types/base_type";

import type { InputUIPropsInterface } from "../ui_types/input_ui_type";

import type { ButtonUIPropsInterface } from "../ui_types/button_ui_type";

import type {
    PaymentStepUIPropsInterface,
    PaymentStepStateInterface,
    PaymentStepComputedInterface,
    PaymentStepComponentsInterface
} from "../ui_types/payment_step_ui_type";

import ButtonUI from "../components/ButtonUI.vue";

import RenderHtmlUtil from "../utils/render_html_util";

import InputUI from "../components/InputUI/BaseInputUI.vue";

import BaseController from "../base_classes/base_controller";

import DecimalAmountUtil from "../utils/decimal_amount_util";

import InputUIPropsBuilder from "../props_builder/input_ui_props_builder";

import ButtonUIPropsBuilder from "../props_builder/button_ui_props_builder";

import PaymentStepUIActionHandler from "../action_handlers/payment_step_ui_action_handler";

class PaymentStepUIController extends BaseController<
    PaymentStepUIPropsInterface,
    PaymentStepStateInterface,
    PaymentStepComputedInterface,
    PaymentStepComponentsInterface
> {
    public override action_handler: PaymentStepUIActionHandler;

    // Method to connect shared step behavior to the standalone component.
    constructor(
        props: PaymentStepUIPropsInterface,
        public readonly step_kind: "details" | "options" | "review"
    ) {
        super("payment_step_ui", props);
        this.action_handler = new PaymentStepUIActionHandler(this);
        this.setActionHandler(this.action_handler);
    }

    // Method to build an editable detail input with inherited styles.
    private getInput(field: "amount" | "description", type: "text" | "textarea"): InputUIPropsInterface {
        return InputUIPropsBuilder.getReactivePropsObject(`${this.props.id}_${field}`, type, undefined, {
            model_value: this.state_refs[field].value,

            class_styles: this.props.class_styles.input,

            boolean_props: {
                disabled: this.props.is_loading || this.state_refs.is_submitting.value,
                read_only: this.props.readonly_fields.includes(field),
                required: field === "amount" || this.props.description_required
            },
            action_props: {
                on_change: async (_event, value) => {
                    return this.action_handler.change(field, value);
                }
            }
        });
    }

    // Method to create navigation buttons without injecting content as markup.
    private getButton(direction: "next" | "back"): ButtonUIPropsInterface {
        const button_html_content = RenderHtmlUtil.renderHtml({
            text: this.props.content_props[`${direction}_btn_text`],
            icon: direction === "next" ? "arrow_right_circle_svg_icon" : "arrow_left_short_circle_svg_icon",
            order: direction === "next" ? "text-first" : "icon-first",
            icon_class_style:
                direction === "next"
                    ? this.props.class_styles.button.icon_class_style
                    : this.props.class_styles.back_button.icon_class_style,
            class_style:
                direction === "next"
                    ? this.props.class_styles.button.text_class_style
                    : this.props.class_styles.back_button.text_class_style
        });

        const loading_html_content = RenderHtmlUtil.renderLoaderHtml();

        return ButtonUIPropsBuilder.getReactivePropsObject(`${this.props.id}_${direction}`, "", undefined, "button", {
            content_props: { button_html_content, loading_html_content },

            class_styles: direction === "back" ? this.props.class_styles.back_button : this.props.class_styles.button,

            boolean_props: {
                disabled:
                    this.props.is_loading ||
                    this.state_refs.is_submitting.value ||
                    (direction === "next" && this.step_kind === "options" && !this.props.options.length)
            },

            action_props: {
                on_click: async () => {
                    if (direction === "back") {
                        this.action_handler.back();
                    } else if (this.step_kind === "details") {
                        await this.action_handler.submitDetails();
                    } else {
                        await this.action_handler.submitSelection();
                    }
                }
            }
        });
    }

    // Method to provide existing toolkit form controls.
    protected getUIComponents(): PaymentStepComponentsInterface {
        return {
            InputUI: markRaw(InputUI),
            ButtonUI: markRaw(ButtonUI)
        };
    }

    // Method to seed an independent editable step from prefills.
    protected getUIStateData(): PaymentStepStateInterface {
        return {
            ...this.props.initial_values,
            amount: DecimalAmountUtil.group(this.props.initial_values.amount),
            selected_id: this.props.selected_id,
            error_text: "",
            is_submitting: false
        };
    }

    // Method to construct inputs, actions, and authoritative review rows.
    protected getUIComputedData(): ComputedDefinitionType<PaymentStepComputedInterface> {
        return {
            currency_input: () => {
                return InputUIPropsBuilder.getReactivePropsObject(`${this.props.id}_currency`, "select", undefined, {
                    model_value: this.state_refs.currency_code.value,

                    content_props: { caret_html_contewnt: SVGIcons.trinagular_caret_down_svg_icon },

                    option_props: this.props.currencies.map((currency) => {
                        return { value: currency.code, label_text: `${currency.code} · ${currency.name}` };
                    }),

                    class_styles: this.props.class_styles.input,

                    boolean_props: {
                        disabled:
                            this.props.is_loading ||
                            this.state_refs.is_submitting.value ||
                            this.props.readonly_fields.includes("currency_code")
                    },

                    action_props: {
                        render_option_label: (option) => {
                            return RenderHtmlUtil.escapeHtml(option.label_text);
                        },

                        fetch_data_method: async (params) => {
                            return {
                                records: this.props.currencies
                                    .filter((item) => {
                                        return `${item.code} ${item.name}`
                                            .toLowerCase()
                                            .includes(String(params.search ?? "").toLowerCase());
                                    })
                                    .map((item) => {
                                        return { value: item.code, label_text: `${item.code} · ${item.name}` };
                                    }),
                                total_pages: 1
                            };
                        },

                        on_change: async (_event, value) => {
                            return this.action_handler.change("currency_code", value);
                        }
                    }
                });
            },

            amount_input: () => {
                return this.getInput("amount", "text");
            },

            description_input: () => {
                return this.getInput("description", "textarea");
            },

            next_button: () => {
                return this.getButton("next");
            },

            back_button: () => {
                return this.getButton("back");
            },

            review_rows: () => {
                const intent = this.props.intent;

                const content = this.props.content_props;

                if (!intent) {
                    return [];
                }

                const amount = (value_text: string): string => {
                    return `${DecimalAmountUtil.group(value_text)} ${intent.currency_code}`;
                };

                return [
                    { label_text: content.amount_label_text, value_text: amount(intent.amount) },
                    { label_text: content.fee_label_text, value_text: amount(intent.fee_amount) },
                    ...(intent.fee_lines ?? []).map((line) => {
                        return { label_text: line.label_text, value_text: amount(line.amount) };
                    }),
                    { label_text: content.net_label_text, value_text: amount(intent.net_amount) },
                    { label_text: content.description_label_text, value_text: intent.description },
                    { label_text: content.reference_label_text, value_text: intent.public_id }
                ];
            }
        };
    }
}
export default PaymentStepUIController;

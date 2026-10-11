import FieldValidator from "../validators/withdrawal_recipient_field_validator";
import { RECIPIENT_VALIDATION_CONTENT } from "../configs/withdrawal_recipient_form_config";

import { markRaw } from "vue";

import { InputType } from "../ui_types/input_ui_type";

import type { ComputedDefinitionType } from "../types/base_type";

import type { ButtonUIPropsInterface } from "../ui_types/button_ui_type";

import type { InputGroupUIPropsInterface } from "../ui_types/input_group_ui_type";

import type { RecipientFieldInterface } from "../types/withdrawal_recipient_form_type";

import type {
    RecipientFormUIPropsInterface as Props,
    RecipientFormStateInterface as State,
    RecipientFormComputedInterface as Computed,
    RecipientFormComponentsInterface as Components
} from "../ui_types/withdrawal_recipient_form_ui_type";

import TabsUI from "../components/TabsUI.vue";

import ButtonUI from "../components/ButtonUI.vue";

import RenderHtmlUtil from "../utils/render_html_util";

import InputGroupUI from "../components/InputGroupUI.vue";

import BaseController from "../base_classes/base_controller";

import TabsUIPropsBuilder from "../props_builder/tabs_ui_props_builder";

import InputUIPropsBuilder from "../props_builder/input_ui_props_builder";

import ButtonUIPropsBuilder from "../props_builder/button_ui_props_builder";

import Handler from "../action_handlers/withdrawal_recipient_form_ui_action_handler";

class WithdrawalRecipientFormUIController extends BaseController<Props, State, Computed, Components> {
    public override action_handler: Handler;

    // Method to connect the reusable recipient form to its state and actions.
    constructor(props: Props) {
        super("withdrawal_recipient_form", props);

        this.action_handler = new Handler(this);

        this.setActionHandler(this.action_handler);
    }

    // Checks whether a field has a previously saved value that has not been replaced during editing.
    private hasStoredField(field: RecipientFieldInterface): boolean {
        return (
            this.props.mode === "edit" &&
            this.props.stored_fields.includes(field.key) &&
            this.state_refs.values.value[field.key] === undefined
        );
    }

    //Returns the appropriate options for a field
    private getFieldOptions(field: RecipientFieldInterface) {
        // Handle options from external data sources
        switch (true) {
            case field.key === "currency_id":
                return this.state_refs.currencies.value.map((item) => ({
                    value: item.code,
                    label_text: `${item.code} · ${item.name}`
                }));

            case field.source === "banks":
                return this.state_refs.banks.value.map((bank) => ({
                    value: bank.code,
                    label_text: bank.name
                }));

            default:
                return this.getStaticFieldOptions(field);
        }
    }

    // Builds options defined directly in the field configuration.
    private getStaticFieldOptions(field: RecipientFieldInterface) {
        return field.options?.map((value) => ({
            value,
            label_text: this.getFieldOptionLabel(field, value)
        }));
    }

    // Resolves the display label for a field option.
    private getFieldOptionLabel(field: RecipientFieldInterface, value: string): string {
        // Account scope labels come from the profile configuration
        if (field.key === "bank_account_scope") {
            const label_key =
                this.computed_refs.profile.value?.category_selector?.options[value]?.label_key ?? `${value}_text`;

            return this.getContentTextValue(label_key);
        }

        // Other fields use their configured option labels
        const label_key = field.option_label_keys?.[value] ?? `${value}_text`;

        return this.getContentTextValue(label_key);
    }

    // Determines the appropriate control type.
    private getFieldControl(field: RecipientFieldInterface): string {
        // Number fields are intentionally rendered as text inputs
        if (field.control === "number") {
            return "text";
        }

        // Respect an explicitly configured control
        if (field.control) {
            return field.control;
        }

        // Automatically select a dropdown for fields with options
        if (field.key === "currency_id" || field.source === "banks" || field.options) {
            return "select";
        }

        return "text";
    }

    // Determines whether a field should be disabled.
    private isFieldDisabled(field: RecipientFieldInterface): boolean {
        // Disable fields during ongoing operations
        if (this.computed_refs.is_busy.value) {
            return true;
        }

        // Disable fields explicitly marked as read-only
        if (this.props.readonly_fields.includes(field.key)) {
            return true;
        }

        // Account names may be managed by account resolution
        if (field.key === "account_name") {
            return !!this.computed_refs.profile.value?.account_resolution?.enabled;
        }

        return !!field.read_only;
    }

    // Resolves the placeholder for a field.
    private getFieldPlaceholder(field: RecipientFieldInterface, has_stored: boolean): string {
        const placeholder_key = has_stored ? "keep_saved_text" : (field.placeholder_key ?? "choose_or_enter_text");

        return this.getContentTextValue(placeholder_key);
    }

    // Builds the input with its model value, styling, event handlers, and reactive disabled state.
    private buildFieldInput(
        field: RecipientFieldInterface,
        options: ReturnType<typeof this.getFieldOptions>,
        has_stored: boolean
    ) {
        // Create input props
        const input_props = InputUIPropsBuilder.getReactivePropsObject(
            `${this.props.id}_${field.key}`,
            this.getFieldControl(field) as InputType,
            undefined,
            {
                model_value: this.state_refs.values.value[field.key] ?? "",
                option_props: options,
                placeholder_text: this.getFieldPlaceholder(field, has_stored),
                class_styles: this.props.class_styles.input,

                // Initial disabled state
                boolean_props: {
                    disabled: this.isFieldDisabled(field)
                },

                // Input interaction handlers
                action_props: {
                    on_change: async (_event, value) => {
                        return this.action_handler.change(
                            field.key,
                            String(value ?? ""),
                            false,
                            !FieldValidator.isBankIdentifier(field.key)
                        );
                    },

                    render_option_label: (option) => {
                        return RenderHtmlUtil.escapeHtml(option.label_text);
                    },

                    fetch_data_method: async (params) => {
                        const search = String(params.search ?? "").toLowerCase();

                        return {
                            records: (options ?? []).filter((option) =>
                                option.label_text.toLowerCase().includes(search)
                            ),
                            total_pages: 1
                        };
                    }
                }
            }
        );

        // Keep the disabled state reactive
        Object.defineProperty(input_props.boolean_props, "disabled", {
            configurable: true,
            get: () => this.isFieldDisabled(field)
        });

        Object.defineProperty(input_props, "validation_error_text", {
            enumerable: true,
            get: () => {
                return this.action_handler.getFieldError(field.key);
            }
        });
        return input_props;
    }

    // Builds an input group with host styling, labels, options, and guarded change handling.
    private buildInputGroupProps(field: RecipientFieldInterface): InputGroupUIPropsInterface {
        // Resolve field configuration
        const has_stored = this.hasStoredField(field);

        const options = this.getFieldOptions(field);

        // Build the input component
        const input_props = this.buildFieldInput(field, options, has_stored);

        // Build the input group
        return {
            id: `${this.props.id}_${field.key}_group`,
            label_text: this.getContentTextValue(field.label_key ?? `${field.key}_text`),
            show_required_text: !!field.required && !has_stored,
            required_text: "*",
            input_props,
            class_styles: this.props.class_styles.group
        };
    }

    // Method to build a styled action without embedding button markup in the view.
    private buildBtnProps(key: string, action: () => Promise<void> | void): ButtonUIPropsInterface {
        const button_props = ButtonUIPropsBuilder.getReactivePropsObject(
            `${this.props.id}_${key}`,
            "",
            undefined,
            "button",
            {
                content_props: { button_html_content: RenderHtmlUtil.escapeHtml(this.getContentTextValue(key)) },

                boolean_props: { disabled: this.computed_refs.is_busy.value },

                class_styles:
                    key === "back_text" || key === "retry_text" || key === "resolve_text"
                        ? this.props.class_styles.secondary_button
                        : this.props.class_styles.button,

                action_props: {
                    on_click: async () => {
                        await action();
                    }
                }
            }
        );

        Object.defineProperty(button_props.boolean_props, "disabled", {
            configurable: true,
            get: () => {
                return (
                    this.computed_refs.is_busy.value ||
                    this.state_refs.is_resolving.value ||
                    (key !== "back_text" && !this.computed_refs.can_submit.value)
                );
            }
        });

        return button_props;
    }

    // Method to reuse toolkit form primitives.
    protected getUIComponents(): Components {
        return {
            InputGroupUI: markRaw(InputGroupUI),
            ButtonUI: markRaw(ButtonUI),
            TabsUI: markRaw(TabsUI)
        };
    }

    // Method to retain draft data in memory for this modal only.
    protected getUIStateData(): State {
        return {
            values: { ...this.props.initial_values },
            touched_fields: {},
            validation_results: {},
            is_validating: false,
            currencies: [...this.props.currencies],
            banks: [],
            is_loading: true,
            is_banks_loading: false,
            is_resolving: false,
            is_submitting: false,
            is_review: false,
            resolution_error_text: "",
            error_text: "",
            lookup_error_text: "",
            resolved_key: ""
        };
    }

    // Method to derive currency-specific fields and keep local and international routes separate.
    protected getUIComputedData(): ComputedDefinitionType<Computed> {
        return {
            can_submit: () => {
                return this.action_handler.canSubmit();
            },

            validation_fields: () => {
                const profile = this.computed_refs.profile.value;

                const fields: RecipientFieldInterface[] = [
                    {
                        key: "currency_id",
                        required: true,
                        options: this.state_refs.currencies.value.map((currency) => {
                            return currency.code;
                        })
                    }
                ];
                if (profile?.holder_selector) {
                    fields.push({
                        key: "account_holder_type",
                        required: true,
                        options: Object.keys(profile.holder_selector.options)
                    });
                }
                if (this.computed_refs.holder_ready.value && profile?.category_selector) {
                    fields.push({
                        key: "bank_account_scope",
                        required: true,
                        options: Object.keys(profile.category_selector.options)
                    });
                }
                return [
                    ...fields,
                    ...this.computed_refs.fields.value.map((field) => {
                        return field.source === "banks"
                            ? {
                                  ...field,
                                  options: this.state_refs.banks.value.map((bank) => {
                                      return bank.code;
                                  })
                              }
                            : field;
                    })
                ];
            },

            currency: () => {
                return this.state_refs.currencies.value.find((currency) => {
                    return currency.code === this.state_refs.values.value.currency_id;
                });
            },

            profile: () => {
                const currency = this.computed_refs.currency.value;
                if (!currency) {
                    return undefined;
                }
                return (
                    this.props.rendering_schema[currency.code] ??
                    (!currency.is_fiat ? this.props.rendering_schema["*"] : undefined)
                );
            },

            holder_ready: () => {
                const selector = this.computed_refs.profile.value?.holder_selector;
                return (
                    !!this.computed_refs.profile.value &&
                    (!selector || !!selector.options[this.state_refs.values.value.account_holder_type ?? ""])
                );
            },

            details_ready: () => {
                return (
                    this.computed_refs.holder_ready.value &&
                    (!this.computed_refs.profile.value?.category_selector || !!this.computed_refs.category.value)
                );
            },

            holder_group: () => {
                const selector = this.computed_refs.profile.value?.holder_selector;

                return this.buildInputGroupProps({
                    key: "account_holder_type",
                    control: "select",
                    label_key: selector?.label_key,
                    options: Object.keys(selector?.options ?? {}),
                    option_label_keys: Object.fromEntries(
                        Object.entries(selector?.options ?? {}).map(([key, option]) => {
                            return [key, option.label_key];
                        })
                    )
                });
            },

            holder_tabs: () => {
                const selector = this.computed_refs.profile.value?.holder_selector;
                return TabsUIPropsBuilder.getReactivePropsObject(
                    `${this.props.id}_holder`,
                    Object.entries(selector?.options ?? {}).map(([key, option]) => {
                        return { tab_key: key, label_text: this.getContentTextValue(option.label_key) };
                    }),
                    {
                        class_styles: this.props.class_styles.tabs,
                        data_props: { active_tab_key: this.state_refs.values.value.account_holder_type ?? "" },
                        boolean_props: { allow_empty_selection: true },
                        action_props: {
                            on_tab_change: async (tab) => {
                                await this.action_handler.change("account_holder_type", tab?.tab_key ?? "");
                            }
                        }
                    }
                );
            },

            category: () => {
                const selector = this.computed_refs.profile.value?.category_selector;
                return this.computed_refs.holder_ready.value
                    ? selector?.options[this.state_refs.values.value[selector.field] ?? ""]
                    : undefined;
            },

            category_group: () => {
                const selector = this.computed_refs.profile.value?.category_selector;

                return this.buildInputGroupProps({
                    key: selector?.field ?? "bank_account_scope",
                    control: "select",
                    label_key: selector?.label_key,
                    required: true,
                    options: Object.keys(selector?.options ?? {})
                });
            },

            is_busy: () => {
                return (
                    this.state_refs.is_loading.value ||
                    this.state_refs.is_submitting.value ||
                    this.state_refs.is_banks_loading.value
                );
            },

            fields: () => {
                const profile = this.computed_refs.profile.value;

                if (!profile || !this.computed_refs.details_ready.value) {
                    return [];
                }

                const currency_profile_category_fields = [
                    ...(this.computed_refs.category.value?.fields ?? []),
                    ...profile.fields
                ];

                return currency_profile_category_fields.map((field) => {
                    return field.source === "networks"
                        ? {
                              ...field,
                              options: field.options ?? this.computed_refs.currency.value?.networks ?? []
                          }
                        : field;
                });
            },

            needs_resolution: () => {
                return (
                    !!this.computed_refs.profile.value?.account_resolution?.enabled &&
                    this.computed_refs.details_ready.value &&
                    this.action_handler.hasDestinationChange()
                );
            },

            groups: () => {
                return this.computed_refs.fields.value.map((field) => {
                    return {
                        props: this.buildInputGroupProps(field),
                        help_text: field.help_key ? this.getContentTextValue(field.help_key) : ""
                    };
                });
            },

            currency_group: () => {
                return this.buildInputGroupProps({ key: "currency_id", control: "select", required: true });
            },

            tabs: () => {
                const tab_props = TabsUIPropsBuilder.getReactivePropsObject(
                    `${this.props.id}_scope`,
                    Object.entries(this.computed_refs.profile.value?.category_selector?.options ?? {}).map(
                        ([key, category]) => {
                            return { tab_key: key, label_text: this.getContentTextValue(category.label_key) };
                        }
                    ),
                    {
                        class_styles: this.props.class_styles.tabs,
                        data_props: { active_tab_key: this.state_refs.values.value.bank_account_scope ?? "" },
                        boolean_props: {
                            allow_empty_selection: true,
                            disabled:
                                this.computed_refs.is_busy.value ||
                                this.props.readonly_fields.includes("bank_account_scope")
                        },
                        action_props: {
                            on_tab_change: async (tab) => {
                                await this.action_handler.change("bank_account_scope", tab?.tab_key ?? "local");
                            }
                        }
                    }
                );
                Object.defineProperty(tab_props.boolean_props, "disabled", {
                    configurable: true,
                    get: () => {
                        return (
                            this.computed_refs.is_busy.value ||
                            this.props.readonly_fields.includes("bank_account_scope")
                        );
                    }
                });
                return tab_props;
            },

            continue_button: () => {
                return this.buildBtnProps(
                    this.state_refs.is_review.value
                        ? this.props.mode === "edit"
                            ? "save_text"
                            : "create_text"
                        : "review_text",
                    this.action_handler.submit
                );
            },

            back_button: () => {
                return this.buildBtnProps("back_text", () => {
                    this.state_refs.is_review.value = false;
                });
            },

            rows: () => {
                const values = this.state_refs.values.value;

                return [
                    { label: this.getContentTextValue("currency_id_text"), value: values.currency_id ?? "" },
                    ...(values.account_holder_type
                        ? [
                              {
                                  label: this.getContentTextValue("account_holder_type_text"),
                                  value: this.getContentTextValue(
                                      this.computed_refs.profile.value?.holder_selector?.options[
                                          values.account_holder_type
                                      ]?.label_key ?? `${values.account_holder_type}_text`
                                  )
                              }
                          ]
                        : []),
                    ...(values.bank_account_scope
                        ? [
                              {
                                  label: this.getContentTextValue("bank_account_scope_text"),
                                  value: this.getContentTextValue(
                                      this.computed_refs.profile.value?.category_selector?.options[
                                          values.bank_account_scope
                                      ]?.label_key ?? `${values.bank_account_scope}_text`
                                  )
                              }
                          ]
                        : []),
                    ...this.computed_refs.fields.value.map((field) => {
                        return {
                            label: this.getContentTextValue(`${field.key}_text`),
                            value:
                                values[field.key] ??
                                (this.props.stored_fields.includes(field.key)
                                    ? this.getContentTextValue("unchanged_text")
                                    : "—")
                        };
                    })
                ];
            }
        };
    }

    // Method to load host currencies and any bank directory after mounting.
    protected async handleOnMountedLogic(): Promise<void> {
        await this.action_handler.initialize();
    }

    // Method to prevent pending lookups from repopulating a closed form.
    protected async handleBeforeUnmountedLogic(): Promise<void> {
        this.action_handler.cleanup();
    }

    // Method to resolve host copy with readable standalone fallbacks.
    public getContentTextValue(key: string): string {
        return (
            this.props.content_props[key] ??
            RECIPIENT_VALIDATION_CONTENT[key] ??
            key
                .replace(/_text$/, "")
                .split("_")
                .join(" ")
        );
    }
}
export default WithdrawalRecipientFormUIController;

import type { Component } from "vue";

import type { InputUIClassStylesInterface } from "./input_ui_type";

import type { TabsUIClassStylesInterface, TabsUIPropsInterface } from "./tabs_ui_type";

import type { ButtonUIClassStylesInterface, ButtonUIPropsInterface } from "./button_ui_type";

import type { InputGroupUIPropsInterface, InputGroupUIClassStylesInterface } from "./input_group_ui_type";

import type {
    RecipientCurrencyInterface,
    RecipientBankInterface,
    RecipientFormValuesType,
    RecipientProfileInterface,
    RecipientRenderingSchemaType,
    RecipientCategoryInterface,
    RecipientFormActionsInterface,
    RecipientValidationResultInterface,
    RecipientFieldKeyType,
    RecipientFieldInterface
} from "../types/withdrawal_recipient_form_type";

export interface RecipientFormClassStylesInterface {
    wrapper: string;
    fields: string;
    title: string;
    section: string;
    field: string;
    help: string;
    resolution_error: string;
    retry_link: string;
    secondary_button: ButtonUIClassStylesInterface;
    notice: string;
    error: string;
    footer: string;
    review_section_wrapper: string;
    review_row: string;
    input: InputUIClassStylesInterface;
    group: InputGroupUIClassStylesInterface;
    button: ButtonUIClassStylesInterface;
    tabs: TabsUIClassStylesInterface;
}
export interface RecipientFormUIPropsInterface {
    id: string;
    mode: "create" | "edit";
    currencies: RecipientCurrencyInterface[];
    rendering_schema: RecipientRenderingSchemaType;
    initial_values: RecipientFormValuesType;
    stored_fields: string[];
    saved_destination_text: string;
    readonly_fields: string[];
    content_props: Record<string, string>;
    class_styles: RecipientFormClassStylesInterface;
    action_props: RecipientFormActionsInterface;
}
export interface RecipientFormStateInterface {
    values: RecipientFormValuesType;
    touched_fields: Partial<Record<RecipientFieldKeyType, boolean>>;
    validation_results: Partial<Record<RecipientFieldKeyType, RecipientValidationResultInterface>>;
    is_validating: boolean;
    currencies: RecipientCurrencyInterface[];
    banks: RecipientBankInterface[];
    is_loading: boolean;
    is_banks_loading: boolean;
    is_resolving: boolean;
    is_submitting: boolean;
    is_review: boolean;
    resolution_error_text: string;
    error_text: string;
    lookup_error_text: string;
    resolved_key: string;
}
export interface RecipientFormComputedInterface {
    currency: RecipientCurrencyInterface | undefined;
    profile: RecipientProfileInterface | undefined;
    fields: RecipientFieldInterface[];
    validation_fields: RecipientFieldInterface[];
    can_submit: boolean;
    groups: { props: InputGroupUIPropsInterface; help_text: string }[];
    category: RecipientCategoryInterface | undefined;
    category_group: InputGroupUIPropsInterface;
    currency_group: InputGroupUIPropsInterface;
    holder_group: InputGroupUIPropsInterface;
    holder_tabs: TabsUIPropsInterface;
    holder_ready: boolean;
    details_ready: boolean;
    tabs: TabsUIPropsInterface;
    continue_button: ButtonUIPropsInterface;
    back_button: ButtonUIPropsInterface;
    rows: { label: string; value: string }[];
    is_busy: boolean;
    needs_resolution: boolean;
}
export interface RecipientFormComponentsInterface {
    InputGroupUI: Component;
    ButtonUI: Component;
    TabsUI: Component;
}

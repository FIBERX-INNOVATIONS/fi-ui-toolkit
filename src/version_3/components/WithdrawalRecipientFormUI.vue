<template>
    <section
        :class="props.class_styles.wrapper"
        :aria-busy="is_busy"
        @focusout="controller.action_handler.blurIdentifier($event)"
    >
        <p :class="props.class_styles.notice">
            {{ controller.getContentTextValue(is_review ? "review_hint_text" : "form_intro_text") }}
        </p>

        <p v-if="props.saved_destination_text" :class="props.class_styles.notice">{{ props.saved_destination_text }}</p>

        <p v-if="props.mode === 'edit'" :class="props.class_styles.notice">
            {{ controller.getContentTextValue("edit_hint_text") }}
        </p>

        <p v-if="is_busy" role="status" :class="props.class_styles.notice">
            {{ controller.getContentTextValue("loading_text") }}
        </p>

        <template v-if="!is_review && !is_loading">
            <div :class="props.class_styles.section">
                <InputGroupUI :key="values.currency_id ?? 'currency'" v-bind="currency_group" />

                <template v-if="profile?.holder_selector">
                    <TabsUI
                        v-if="profile.holder_selector.control === 'tabs'"
                        :key="`${values.currency_id}_holder_tabs`"
                        v-bind="holder_tabs"
                    />

                    <fieldset v-else-if="profile.holder_selector.control === 'radio'" :class="props.class_styles.field">
                        <legend>{{ controller.getContentTextValue(profile.holder_selector.label_key) }}</legend>

                        <label v-for="(option, key) in profile.holder_selector.options" :key="key">
                            <input
                                type="radio"
                                :name="`${props.id}_holder`"
                                :value="key"
                                :checked="values.account_holder_type === key"
                                :disabled="is_busy"
                                @change="controller.action_handler.change('account_holder_type', String(key))"
                            />
                            {{ controller.getContentTextValue(option.label_key) }}
                        </label>
                    </fieldset>

                    <InputGroupUI v-else :key="`${values.currency_id}_holder_select`" v-bind="holder_group" />
                </template>

                <p
                    v-if="
                        profile?.holder_selector?.control !== 'select' &&
                        controller.action_handler.getFieldError('account_holder_type')
                    "
                    role="alert"
                    :class="props.class_styles.resolution_error"
                >
                    {{ controller.action_handler.getFieldError("account_holder_type") }}
                </p>

                <template v-if="holder_ready && profile?.category_selector">
                    <TabsUI
                        :key="`${values.currency_id}_${values.account_holder_type}_scope_tabs`"
                        v-if="profile.category_selector.control === 'tabs'"
                        v-bind="tabs"
                    />
                    <fieldset
                        v-else-if="profile.category_selector.control === 'radio'"
                        :class="props.class_styles.field"
                    >
                        <legend>{{ controller.getContentTextValue(profile.category_selector.label_key) }}</legend>
                        <label v-for="(option, key) in profile.category_selector.options" :key="key">
                            <input
                                type="radio"
                                :name="`${props.id}_scope`"
                                :value="key"
                                :checked="values.bank_account_scope === key"
                                :disabled="is_busy"
                                @change="controller.action_handler.change('bank_account_scope', String(key))"
                            />
                            {{ controller.getContentTextValue(option.label_key) }}
                        </label>
                    </fieldset>

                    <InputGroupUI
                        v-else
                        :key="`${values.currency_id}_${values.account_holder_type}_scope_select`"
                        v-bind="category_group"
                    />

                    <p
                        v-if="
                            profile.category_selector.control !== 'select' &&
                            controller.action_handler.getFieldError('bank_account_scope')
                        "
                        role="alert"
                        :class="props.class_styles.resolution_error"
                    >
                        {{ controller.action_handler.getFieldError("bank_account_scope") }}
                    </p>
                    <p v-if="category?.description_key" :class="props.class_styles.help">
                        {{ controller.getContentTextValue(category.description_key) }}
                    </p>
                </template>
            </div>

            <p v-if="values.currency_id && !profile && !is_loading" :class="props.class_styles.notice">
                {{ controller.getContentTextValue("unsupported_text") }}
            </p>

            <div :class="props.class_styles.fields">
                <div
                    v-for="group in groups"
                    :key="`${values.currency_id}_${values.bank_account_scope}_${is_banks_loading}_${group.props.id}`"
                    :class="props.class_styles.field"
                >
                    <InputGroupUI v-bind="group.props" />
                    <template
                        v-if="
                            group.props.input_props?.id === `${props.id}_account_name` &&
                            profile?.account_resolution?.enabled
                        "
                    >
                        <p v-if="is_resolving" role="status" :class="props.class_styles.help">
                            {{ controller.getContentTextValue("resolving_account_text") }}
                        </p>
                        <p v-else-if="resolution_error_text" role="alert" :class="props.class_styles.resolution_error">
                            {{ resolution_error_text }}
                            <button
                                type="button"
                                :class="props.class_styles.retry_link"
                                @click="controller.action_handler.resolve()"
                            >
                                {{ controller.getContentTextValue("retry_resolution_text") }}
                            </button>
                        </p>
                    </template>
                    <p
                        v-if="group.help_text && !is_resolving && !resolution_error_text"
                        :class="props.class_styles.help"
                    >
                        {{ group.help_text }}
                    </p>
                </div>
            </div>

            <p v-if="lookup_error_text" role="status" :class="props.class_styles.notice">{{ lookup_error_text }}</p>
        </template>

        <dl :class="props.class_styles.review_section_wrapper" v-else-if="is_review">
            <div v-for="row in rows" :key="row.label" :class="props.class_styles.review_row">
                <dt>{{ row.label }}</dt>
                <dd>{{ row.value }}</dd>
            </div>
        </dl>

        <p v-if="error_text" role="alert" :class="props.class_styles.error">{{ error_text }}</p>

        <div :class="props.class_styles.footer">
            <ButtonUI v-if="is_review" v-bind="back_button" />
            <!-- Recreate the button when its action changes; ButtonUI captures its initial content props. -->
            <ButtonUI v-if="details_ready" :key="continue_button.id" v-bind="continue_button" />
        </div>
    </section>
</template>

<script setup lang="ts">
import Props from "../props/withdrawal_recipient_form_ui_props";

import Controller from "../controllers/withdrawal_recipient_form_ui_controller";

const props = defineProps(Props);

const controller = new Controller(props);

const { state_refs, computed_refs, components } = controller.getComponentDefinition();

const {
    is_resolving,
    resolution_error_text,
    values,
    is_banks_loading,
    is_loading,
    is_review,
    error_text,
    lookup_error_text
} = state_refs;

const {
    is_busy,
    holder_group,
    holder_tabs,
    holder_ready,
    details_ready,
    profile,
    category,
    category_group,
    currency_group,
    tabs,
    groups,
    rows,
    back_button,
    continue_button
} = computed_refs;

const { InputGroupUI, TabsUI, ButtonUI } = components;
</script>

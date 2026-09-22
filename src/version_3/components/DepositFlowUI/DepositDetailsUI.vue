<template>
    <section :class="props.class_styles.wrapper" :aria-busy="props.is_loading">
        <ButtonUI v-if="props.action_props.on_back" v-bind="back_button" />

        <header>
            <h2 :class="props.class_styles.title">{{ props.content_props.title_text }}</h2>
            <p :class="props.class_styles.subtitle">{{ props.content_props.subtitle_text }}</p>
        </header>

        <p v-if="error_text" :class="props.class_styles.error" role="alert">{{ error_text }}</p>

        <div :class="props.class_styles.field">
            <label :for="`${props.id.toLowerCase()}_currency_select_search`" :class="props.class_styles.label">
                {{ props.content_props.currency_label_text }}
            </label>

            <InputUI :key="`${props.is_loading}:${is_submitting}`" v-bind="currency_input" />
        </div>

        <div :class="props.class_styles.field" @focusout="action_handler.formatAmountOnOutOfFocus">
            <label :for="`${props.id}_amount`" :class="props.class_styles.label">
                {{ props.content_props.amount_label_text }}
            </label>

            <InputUI :key="`${props.is_loading}:${is_submitting}`" v-bind="amount_input" />
        </div>

        <div :class="props.class_styles.field">
            <label :for="`${props.id}_description`" :class="props.class_styles.label">
                {{ props.content_props.description_label_text }}
            </label>

            <InputUI :key="`${props.is_loading}:${is_submitting}`" v-bind="description_input" />
        </div>

        <div :class="props.class_styles.footer">
            <ButtonUI v-bind="next_button" />
        </div>
    </section>
</template>

<script setup lang="ts">
import PaymentStepUIProps from "../../props/payment_step_ui_props";

import PaymentStepUIController from "../../controllers/payment_step_ui_controller";

const props = defineProps(PaymentStepUIProps);

const controller = new PaymentStepUIController(props, "details");

const { state_refs, computed_refs, components } = controller.getComponentDefinition();

const { action_handler } = controller;

const { is_submitting, error_text } = state_refs;

const { currency_input, amount_input, description_input, next_button, back_button } = computed_refs;

const { InputUI, ButtonUI } = components;
</script>

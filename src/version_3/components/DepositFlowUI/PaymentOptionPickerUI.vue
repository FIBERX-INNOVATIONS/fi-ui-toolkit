<template>
    <section :class="props.class_styles.wrapper" :aria-busy="props.is_loading">
        <ButtonUI v-if="props.action_props.on_back" v-bind="back_button" />

        <header>
            <h2 :class="props.class_styles.title">{{ props.content_props.title_text }}</h2>
            <p v-if="'options' !== 'options'" :class="props.class_styles.subtitle">
                {{ props.content_props.subtitle_text }}
            </p>
        </header>

        <p v-if="error_text" :class="props.class_styles.error" role="alert">{{ error_text }}</p>

        <fieldset :class="props.class_styles.options" :disabled="props.is_loading || is_submitting">
            <legend :class="props.class_styles.label">{{ props.content_props.subtitle_text }}</legend>

            <label v-for="option in props.options" :key="option.id" :class="props.class_styles.option">
                <input
                    :class="props.class_styles.radio"
                    type="radio"
                    :name="props.id"
                    :value="option.id"
                    :checked="selected_id === option.id"
                    @change="action_handler.select"
                />
                <span :class="props.class_styles.check" aria-hidden="true">✓</span>
                <span :class="props.class_styles.option_body">
                    <span :class="props.class_styles.option_name">{{ option.name }}</span>
                    <span v-if="option.description" :class="props.class_styles.option_description">
                        {{ option.description }}
                    </span>
                    <span v-if="option.fee_label_text" :class="props.class_styles.option_description">
                        {{ option.fee_label_text }}
                    </span>
                </span>
            </label>
        </fieldset>

        <p v-if="!props.options.length" :class="props.class_styles.subtitle">{{ props.content_props.empty_text }}</p>

        <div :class="props.class_styles.footer"><ButtonUI v-bind="next_button" /></div>
    </section>
</template>

<script setup lang="ts">
import PaymentStepUIProps from "../../props/payment_step_ui_props";

import PaymentStepUIController from "../../controllers/payment_step_ui_controller";

const props = defineProps(PaymentStepUIProps);

const controller = new PaymentStepUIController(props, "options");

const { state_refs, computed_refs, components } = controller.getComponentDefinition();

const { action_handler } = controller;

const { is_submitting, error_text, selected_id } = state_refs;

const { next_button, back_button } = computed_refs;

const { ButtonUI } = components;
</script>

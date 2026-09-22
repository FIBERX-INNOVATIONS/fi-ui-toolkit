<template>
    <section :class="props.class_styles.wrapper" :aria-busy="props.is_loading">
        <ButtonUI v-if="props.action_props.on_back" v-bind="back_button" />

        <header>
            <h2 :class="props.class_styles.title">{{ props.content_props.title_text }}</h2>
            <p :class="props.class_styles.subtitle">{{ props.content_props.subtitle_text }}</p>
        </header>

        <p v-if="error_text" :class="props.class_styles.error" role="alert">{{ error_text }}</p>

        <dl :class="props.class_styles.total">
            <div v-for="(row, index) in review_rows" :key="index" :class="props.class_styles.row">
                <dt>{{ row.label_text }}</dt>
                <dd :class="props.class_styles.value">{{ row.value_text }}</dd>
            </div>
        </dl>

        <p :class="props.class_styles.subtitle">{{ props.content_props.review_note_text }}</p>
    </section>
</template>
<script setup lang="ts">
import PaymentStepUIProps from "../../props/payment_step_ui_props";

import PaymentStepUIController from "../../controllers/payment_step_ui_controller";

const props = defineProps(PaymentStepUIProps);

const controller = new PaymentStepUIController(props, "review");

const { state_refs, computed_refs, components } = controller.getComponentDefinition();

const { action_handler } = controller;

const { error_text } = state_refs;

const { review_rows, back_button } = computed_refs;

const { ButtonUI } = components;
</script>

<template>
    <section :class="props.class_styles.wrapper" :aria-busy="props.is_loading || is_launching">
        <header>
            <h2 :class="props.class_styles.title">{{ props.content_props.title_text }}</h2>
            <p :class="props.class_styles.subtitle">{{ props.content_props.subtitle_text }}</p>
        </header>

        <p :class="props.class_styles.notice" role="status" aria-live="polite">{{ message_text }}</p>

        <p v-if="error_text" :class="props.class_styles.error" role="alert">{{ error_text }}</p>

        <dl :class="props.class_styles.rows">
            <div v-for="row in rows" :key="row.label_text" :class="props.class_styles.row">
                <dt>{{ row.label_text }}</dt>
                <dd :class="props.class_styles.value">{{ row.value_text }}</dd>
            </div>
        </dl>

        <template v-if="iframe_url && iframe_url === checkout_link">
            <p :class="props.class_styles.subtitle">{{ props.content_props.frame_note_text }}</p>
            <iframe
                :src="iframe_url"
                :title="props.content_props.iframe_title_text"
                :class="props.class_styles.iframe"
                sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                referrerpolicy="no-referrer"
                allow="payment"
            />
        </template>

        <div :class="props.class_styles.actions">
            <ButtonUI v-if="can_launch" v-bind="launch_button" />
            <a
                v-if="checkout_link && !props.is_loading && !is_launching"
                :href="checkout_link"
                @click="controller.action_handler.markCheckoutStarted"
                @auxclick.middle="controller.action_handler.markCheckoutStarted"
                target="_blank"
                rel="noopener noreferrer"
                :class="props.class_styles.link"
            >
                {{ props.content_props.open_tab_text }}
            </a>
            <ButtonUI v-if="can_refresh" v-bind="refresh_button" />
            <ButtonUI v-if="can_start_new && props.action_props.on_new_deposit" v-bind="new_deposit_button" />
        </div>
    </section>
</template>

<script setup lang="ts">
import PaymentCheckoutUIProps from "../../props/payment_checkout_ui_props";

import PaymentCheckoutUIController from "../../controllers/payment_checkout_ui_controller";

const props = defineProps(PaymentCheckoutUIProps);

const controller = new PaymentCheckoutUIController(props);

const { state_refs, computed_refs, components } = controller.getComponentDefinition();

const { iframe_url, is_launching, error_text } = state_refs;

const {
    message_text,
    rows,
    checkout_link,
    can_launch,
    can_refresh,
    can_start_new,
    launch_button,
    refresh_button,
    new_deposit_button
} = computed_refs;

const { ButtonUI } = components;
</script>

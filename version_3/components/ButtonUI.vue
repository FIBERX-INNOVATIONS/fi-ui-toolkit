<template>
    <div :class="class_styles.wrapper_class_style">

        <button
            :id="id"
            :type="type"
            :disabled="is_disabled"
            :class="button_class"
            @click="action_handler?.handleOnClick?.($event)"
            @mouseover="action_handler?.handleOnHover?.($event)"
        >

            <span v-if="is_loading"
                v-html="content_props.loading_html_content">
            </span>

            <span v-else
                v-html="content_props.button_html_content">
            </span>

        </button>

    </div>
</template>

<script setup lang="ts">

import ButtonUIProps from "../props/button_ui_props";
import ButtonUIController from "../controllers/button_ui_controller";

const props         = defineProps(ButtonUIProps);
const controller    = new ButtonUIController(props);

const {
    id,
    type,
    content_props,
    class_styles,
    boolean_props
} = props;

const {
    state_refs,
    computed_refs,
    action_handler
} = controller;

const {
    is_loading
} = state_refs;

const {
    is_disabled
} = computed_refs;



const button_class = `${class_styles.button_class_style} ${is_disabled.value ? class_styles.disabled_class_style : ""} ${is_loading.value ? class_styles.loading_class_style : ""}`;

</script>
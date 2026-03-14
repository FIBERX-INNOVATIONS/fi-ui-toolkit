<template>
    <div
        :id="props.id"
        :class="class_styles.wrapper_class_style"
        @click="action_handler?.handleOnClick?.($event)"
    >

        <img
            v-if="computed_refs.show_image.value"
            :src="src"
            :alt="alt_text"
            :loading="boolean_props.lazy_load ? 'lazy' : 'eager'"
            :class="[
                class_styles.image_class_style,
                state_refs.is_loading ? class_styles.loading_class_style : ''
            ]"
            @load="action_handler?.handleOnLoad?.()"
            @error="action_handler?.handleOnError?.()"
        />

        <div
            v-if="content"
            :class="class_styles.content_wrapper_class_style"
            v-html="content"
        ></div>

    </div>
</template>

<script setup lang="ts">

import ImageRenderUIProps from "../props/image_render_ui_props";
import ImageRenderUIController from "../controllers/image_render_ui_controller";

const props = defineProps(ImageRenderUIProps);

const controller = new ImageRenderUIController(props);

const {
    src,
    alt_text,
    content,
    boolean_props,
    class_styles
} = props;

const {
    state_refs,
    computed_refs,
    action_handler
} = controller;

const {
    show_image
} = computed_refs

</script>
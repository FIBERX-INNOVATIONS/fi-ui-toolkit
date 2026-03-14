<template>
    <div
        v-if="computed_refs.show_overlay.value"
        :id="id"
        :class="class_styles.wrapper_class_style"
    >

        <!-- overlay background -->
        <div
            :class="class_styles.overlay_class_style"
            @click="action_handler?.handleOverlayClick?.($event)"
        ></div>

            <!-- modal content -->
            <div :class="class_styles.content_wrapper_class_style">

            <slot />

            </div>

    </div>
</template>

<script setup lang="ts">

import OverlayUIProps from "../props/overlay_ui_props";
import OverlayUIController from "../controllers/overlay_ui_controller";

const props = defineProps(OverlayUIProps);

const controller = new OverlayUIController(props);

const {
    id,
    class_styles
} = props;

const {
    computed_refs,
    action_handler
} = controller;

</script>
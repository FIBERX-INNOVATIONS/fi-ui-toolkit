<template>
    <div
        v-if="visible"
        :class="[
            class_styles?.wrapper_class_style,
            class_styles?.border_class_style(status),
            class_styles?.text_class_style(status)
        ]"
    >
        <div
            @click="action_handler?.handleOnClick?.($event)"
            :class="[class_styles?.icon_wrapper_class_style, class_styles?.text_class_style(status)]"
        >
            <span :class="class_styles?.icon_class_style" v-html="getSVGIconValue(status_icon)"></span>
        </div>

        <p :class="[class_styles?.message_class_style, class_styles?.text_class_style(status)]" v-html="message"></p>
    </div>
</template>

<script setup lang="ts">
import { getSVGIconValue } from "../resources/svg_icon_resource";
import ToasterUIProps from "../props/toaster_ui_props";
import ToasterUIController from "../controllers/toaster_ui_controller";

const props = defineProps(ToasterUIProps);

const controller = new ToasterUIController(props);

const { state_refs, action_handler } = controller;

const { visible } = state_refs;

const { class_styles, status, status_icon, message } = props;
</script>

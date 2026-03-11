<template>
    <div
        v-if="visible"
        :class="[
            class_styles?.wrapper_class_style, 
            class_styles?.border_class_style(props.status),
            class_styles?.text_class_style(props.status),
        ]"
    >

        <div
            @click="action_handler?.handleOnClick?.($event)"
            :class="[
                class_styles?.icon_wrapper_class_style,
                class_styles?.text_class_style(props.status),
            ]"
        >
            <span
                :class="class_styles?.icon_class_style"
                v-html="getSVGIconValue(props.status_icon)"
            ></span>
        </div>

        <p
            :class="[
                class_styles?.message_class_style,
                class_styles?.text_class_style(props.status),
            ]"
            v-html="props.message"
        ></p>

    </div>

</template>


<script setup lang="ts">
import { getSVGIconValue }          from "../resources/svg_icon_resource"
import ToasterUIProps from "../props/toaster_ui_props";
import ToasterUIController from "../controllers/toaster_ui_controller";

const props = defineProps(ToasterUIProps);

const controller = new ToasterUIController(props);

const {
    state_refs,
    action_handler,
} = controller;

const {
    visible
} = state_refs;

const {
    class_styles
} = props;


</script>
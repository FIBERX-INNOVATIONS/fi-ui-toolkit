<template>
    <div v-show="props.visible" :class="props.class_styles.wrapper_class_style">
        <div :id="props.alert_box_id" :class="props.class_styles.alert_box_class_style">

            <button
                @click="action_handler?.handleOnClick($event)"
                :class="props.class_styles.close_btn_class_style"
            >
                <span v-html="getSVGIconValue(props.close_btn_icon)"></span>
            </button>

            <div :class="props.class_styles.status_icon_wrapper_class_style">
                <span :class="props.class_styles.status_icon_class_style" v-html="getSVGIconValue(props.status_icon)"></span>
            </div>

            <div :class="props.class_styles.status_content_wrapper_class_style">
                <p :class="props.class_styles.status_content_class_style" v-html="props.status_content_messgae"></p>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { getSVGIconValue }          from "../resources/svg_icon_resource"
import StatusAlertUIProps           from "../props/status_alert_ui_props"
import StatusAlertUIController      from "../controllers/status_alert_ui_controller";

const props         = defineProps(StatusAlertUIProps);
const controller    = new StatusAlertUIController(props);

const {
    state_refs,
    action_handler
} = controller;

</script>
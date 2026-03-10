
<template>
    <div :class="class_styles.wrapper_class_style">
        <!-- Label -->
        <div
            v-if="props.label_text"
            :class="class_styles.label_wrapper_class_style"
        >

            <label
                :for="props?.input_props?.id ?? ''"
                :class="class_styles.label_text_class_style"
            >
                {{ props.label_text }}
            </label>

            <span
                v-if="props.show_required_text"
                :class="class_styles.required_text_class_style"
            >
                {{ props.required_text }}
            </span>

        </div>


        <!-- Input -->
        <div v-if="props.input_props" :class="class_styles.group_input_wrapper_class_style">
            <InputUI v-bind="props.input_props" />
        </div>
    </div>
</template>

<script setup lang="ts">

import InputGroupUIProps from "../props/input_group_ui_props";
import InputGroupUIController from "../controllers/input_group_ui_controller";

import InputUI from "./InputUI/BaseInputUI.vue";

const props = defineProps(InputGroupUIProps);

new InputGroupUIController(props);

const {
    class_styles
} = props;

</script>
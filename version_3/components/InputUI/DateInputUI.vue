<template>
    <div :class="class_styles.wrapper_class_style">
        <VueDatePicker
            :id="id"
            :name="id"
            :ui="{ input: input_class_style }"
            v-model="input_value"
            :placeholder="placeholder_text"
            :required="boolean_props.required"
            :readonly="boolean_props.read_only"
            :disabled="boolean_props.disabled"
            @input="action_handler?.handleOnInpuChange?.($event)"
            @click="action_handler?.handleOnClick?.($event)"
        />

        <span 
            v-if="helper_text"
            :class="class_styles.helper_text_class_style"
            v-html="helper_text"
        ></span>

        <span 
            v-if="error_text"xs
            :class="class_styles.error_text_class_style"
            v-html="error_text"
        ></span>
    </div>

</template>

<script setup lang="ts">
import InputUIProps      from "../../props/input_ui_props";
import InputUIController from "../../controllers/input_ui_controller";

const props         = defineProps(InputUIProps);
const controller    = new InputUIController(props);

const {
    id,
    type,
    placeholder_text,
    helper_text,
    class_styles,
    number_props,
    boolean_props
} = props

const {
    state_refs,
    action_handler,
    components
} = controller;

const { VueDatePicker } = components

const {
    input_value,
    error_text
} = state_refs

const readonly_class_style  = boolean_props.read_only ? class_styles.input_readonly_class_style : "";
const input_class_style     = [
    class_styles.input_class_style,
    readonly_class_style
].join(" ");

</script>
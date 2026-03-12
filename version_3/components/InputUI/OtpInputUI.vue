<template>
    <div :class="class_styles.wrapper_class_style">
        <div :class="class_styles.otp_wrapper_class_style">
            <input
            v-for="(_, index) in number_props.length"
                :key="index"
                :id="`${id}_${index}`"
                :name="`${id}_${index}`"
                type="text"
                inputmode="numeric"
                :class="input_class_style"
                :placeholder="placeholder_text?.[index]"
                :required="boolean_props.required"
                :readonly="boolean_props.read_only"
                :maxlength="number_props.length"
                :disabled="boolean_props.disabled"
                @input="action_handler?.handleOnOTPInput?.($event, index)"
                @keydown="action_handler?.handleOnOTPKeydown?.($event, index)"
                @paste="action_handler?.handleOnOTPPaste?.($event, index)"
            />
        </div>

        <span 
            v-if="helper_text"
            :class="class_styles.helper_text_class_style"
            v-html="helper_text"
        ></span>

        <span 
            v-if="error_text"
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
    action_handler
} = controller;

const {
    input_value,
    error_text
} = state_refs

const input_class_style = `
${class_styles.input_class_style}  
${boolean_props.read_only ? class_styles.input_readonly_class_style : ''}
`

</script>
<template>
    <div :class="class_styles.wrapper_class_style">
        <div 
            v-if="is_loading" 
            :class="class_styles.loader_class_style" 
            v-html="content_props.loader_html_content"
        ></div>

        <button
            v-else
            :id="switch_btn_id"
            role="switch"
            type="button"
            :class="[class_styles.switch_btn_class_style, (InputTransformerUtil.resolveTypedValue(input_value)) ? class_styles.active_class_style : class_styles.inactive_class_style]"
            @click="action_handler?.handleOnSwitchToggle?.($event)"
        >
            <input
                :id="id"
                :name="id"
                type="checkbox"
                class="sr-only peer"
                v-model="input_value"
                :required="boolean_props.required"
                :disabled="boolean_props.disabled"
                @change="action_handler?.handleOnInpuChange?.($event)"
            />
            <span :class="[class_styles.knob_class_style, InputTransformerUtil.resolveTypedValue(input_value) ? 'translate-x-6' : 'translate-x-1']"></span>
            <span v-if="helper_text" :class="class_styles.helper_text_class_style" v-html="class_styles.helper_text_class_style"></span>
        </button>

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
import InputTransformerUtil from "../../utils/input_transformer_util";

const props         = defineProps(InputUIProps);
const controller    = new InputUIController(props);

const {
    id,
    switch_btn_id,
    type,
    placeholder_text,
    helper_text,
    class_styles,
    number_props,
    boolean_props,
    content_props
} = props

const {
    state_refs,
    action_handler
} = controller;

const {
    input_value,
    error_text,
    is_loading
} = state_refs


</script>
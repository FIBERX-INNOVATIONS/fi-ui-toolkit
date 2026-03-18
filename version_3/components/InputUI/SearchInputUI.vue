<template>
    <div :class="class_styles.wrapper_class_style">
        <div :class="class_styles.search_wrapper_class_style">
            <span 
                v-if="content_props.search_icon_html_content"
                :class="class_styles.search_icon_class_style"
                v-html="content_props.search_icon_html_content"
                @click="action_handler?.handleOnClick?.($event)"
            >
            </span>

            <input
                :id="id"
                :name="id"
                type="search"
                :class="input_class_style"
                v-model="input_value"
                :placeholder="placeholder_text"
                :required="boolean_props.required"
                :readonly="boolean_props.read_only"
                :disabled="boolean_props.disabled"
                @input="action_handler?.handleOnInpuChange?.($event)"
                @keyup="action_handler?.handleOnKeyup?.($event)"
                @keydown="action_handler?.handleOnKeydown?.($event)"
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

const readonly_class_style  = boolean_props.read_only ? class_styles.input_readonly_class_style : "";
const input_class_style     = [ 
    class_styles.input_class_style,
    readonly_class_style,
    class_styles.search_input_class_style
].join(" ");

</script>
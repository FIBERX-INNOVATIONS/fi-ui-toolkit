<template>
    <div :class="class_styles.wrapper_class_style">
        <div
            :id="`${id}_date_range_picker`" 
            :class="class_styles.range_container_class_style">

            <input
                :id="`${id}_from_date_range`"
                :name="`${id}_from_date_range`"
                type="text"
                v-model="start_date"
                :placeholder="placeholder_text"
                :required="boolean_props.required"
                :readonly="boolean_props.read_only"
                :disabled="boolean_props.disabled"
                :class="input_class_style"
                @click="action_handler?.handleOnClick?.($event)"
            />

            <span 
                v-if="seperator_icon"
                :class="class_styles.range_separator_class_style"
                v-html="getSVGIconValue(seperator_icon)"
            >
            </span>

            <input
                :id="`${id}_to_date_range`"
                :name="`${id}_to_date_range`"
                type="text"
                v-model="end_date"
                :placeholder="placeholder_text"
                :required="boolean_props.required"
                :readonly="boolean_props.read_only"
                :disabled="boolean_props.disabled"
                :class="input_class_style"
                @click="action_handler?.handleOnClick?.($event)"
            />

        </div>

        <span v-if="helper_text"
              :class="class_styles.helper_text_class_style"
              v-html="helper_text"></span>

        <span v-if="error_text"
              :class="class_styles.error_text_class_style"
              v-html="error_text"></span>
    </div>
</template>

<script setup lang="ts">
import InputUIProps      from "../../props/input_ui_props";
import InputUIController from "../../controllers/input_ui_controller";
import { getSVGIconValue } from "../../resources/svg_icon_resource";

const props         = defineProps(InputUIProps);
const controller    = new InputUIController(props);

const {
    id,
    type,
    placeholder_text,
    helper_text,
    class_styles,
    content_props,
    boolean_props
} = props

const {
    state_refs,
    action_handler
} = controller;

const {
    input_value,
    start_date,
    end_date,
    error_text
} = state_refs

const seperator_icon        = content_props?.seperator_icon_html ?? "arrow_long_right_svg_icon";
const readonly_class_style  = boolean_props.read_only ? class_styles.input_readonly_class_style : "";
const input_class_style     = [
    class_styles.input_class_style,
    readonly_class_style
].join(" ");

</script>
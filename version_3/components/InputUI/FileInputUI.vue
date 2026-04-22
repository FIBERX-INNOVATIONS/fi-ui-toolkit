<template>
    <div :class="class_styles.wrapper_class_style">
        <input
            :id="id"
            :name="id"
            type="file"
            :class="[input_class_style]"
            :placeholder="placeholder_text"
            :required="boolean_props.required"
            :readonly="boolean_props.read_only"
            :disabled="boolean_props.disabled"
            :accept="file_props.accept"
            :multiple="file_props.multiple"
            @change="action_handler?.handleOnFileInpuChange?.($event)"
            @click="action_handler?.handleOnClick?.($event)"
        />

        <!-- ✅ PREVIEW SECTION -->
        <div
            v-if="file_props.enable_preview && computed_refs?.preview_url?.value"
            :class="class_styles.preview_wrapper_class_style"
        >
            <!-- IMAGE PREVIEW -->
            <img
                v-if="computed_refs?.is_image_preview?.value"
                :src="computed_refs?.preview_url?.value"
                :class="class_styles.img_preview_class_style"
            />

            <!-- GENERIC FILE PREVIEW -->
            <div
                v-else
                :class="class_styles.generic_file_preview_wrapper_class_style"
            >
                <span
                    :class="class_styles.generic_file_preview_icon_class_style"
                    v-html="getSVGIconValue(file_props?.generic_file_preview_icon ?? 'paper_clip_attachment_svg_icon')"
                ></span>
                <span
                    :class="class_styles.generic_file_preview_content_class_style"
                    v-html="file_props?.generic_file_preview_content ?? computed_refs?.file_name?.value ?? 'Selected file'"
                ></span>
            </div>
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
import { getSVGIconValue } from "../../resources/svg_icon_resource";

const props         = defineProps(InputUIProps);
const controller    = new InputUIController(props);

const {
    id,
    type,
    placeholder_text,
    helper_text,
    class_styles,
    file_props,
    boolean_props
} = props

const {
    state_refs,
    computed_refs,
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
    class_styles.file_input_class_style

].join(" ");

</script>
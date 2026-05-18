<template>
    <div :class="class_styles.wrapper_class_style">
        <p :class="class_styles.text_class_style">
            {{ copyright_text }}
        </p>
    </div>
</template>

<script setup lang="ts">
import CopyRightUIProps from "../props/copy_right_ui_props";
import CopyRightUIController from "../controllers/copy_right_ui_controller";

const props = defineProps(CopyRightUIProps);
const controller = new CopyRightUIController(props);

const { class_styles } = props;

const { copyright_text } = controller.computed_refs;
</script>

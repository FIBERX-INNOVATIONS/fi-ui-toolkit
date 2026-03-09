<template>
    <div :class="props.class_styles.wrapper_class_style">
        <p :class="props.class_styles.text_class_style">
            © {{ props?.year_text ?? "" }} {{ props?.powered_by_text ?? "" }}  {{  props?.author_text ?? "" }}
        </p>
    </div>
</template>

<script setup lang="ts">
import CopyRightUIProps      from "../props/copy_right_ui_props";
import CopyRightUIController from "../controllers/copy_right_ui_controller";

const props         = defineProps(CopyRightUIProps);
const controller    = new CopyRightUIController(props)
</script>
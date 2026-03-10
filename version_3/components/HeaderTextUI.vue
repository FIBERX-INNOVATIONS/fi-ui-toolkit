<template>
    <component
        :is="props.header_tag"
        :class="props.class_styles?.text_class_style"
    >
        {{ props.text_value }}
    </component>
</template>

<script setup lang="ts">
import HeaderTextUIProps      from "../props/header_text_ui_props";
import HeaderTextUIController from "../controllers/header_text_ui_controller";

const props         = defineProps(HeaderTextUIProps);
const controller    = new HeaderTextUIController(props)
</script>
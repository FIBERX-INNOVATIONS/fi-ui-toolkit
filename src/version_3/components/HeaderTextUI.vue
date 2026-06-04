<template>
    <component :is="header_tag" :class="class_styles.text_class_style">
        {{ text_value }}
    </component>
</template>

<script setup lang="ts">
import HeaderTextUIProps from "../props/header_text_ui_props";
import HeaderTextUIController from "../controllers/header_text_ui_controller";

const props = defineProps(HeaderTextUIProps);
new HeaderTextUIController(props);

const { header_tag, text_value, class_styles } = props;
</script>

<template>
    <div v-for="(_, index) in number_of_cards" :key="index" role="status" :class="wrapper_class_style"></div>
</template>

<script setup lang="ts">
import CardLoaderUIProps from "./card_loader_ui_props";
import CardLoaderUIController from "./card_loader_ui_controller";

const props = defineProps(CardLoaderUIProps);
new CardLoaderUIController(props);

const {
    number_of_cards,
    wrapper_class_style
} = props;
</script>

<template>
    <div :id="id" :class="class_styles.wrapper_class_style" :style="wrapper_style">
        <div v-if="has_items" :class="class_styles.menu_class_style">
            <div
                v-for="(item, index) in display_items"
                :key="item.id ?? index"
                :class="class_styles.menu_item_wrapper_class_style"
            >
                <NavLinkUI v-bind="item" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import DropdownMenuUIProps from "../props/dropdown_menu_ui_props";
import DropdownMenuUIController from "../controllers/dropdown_menu_ui_controller";

const props = defineProps(DropdownMenuUIProps);

const controller = new DropdownMenuUIController(props);

const { id, class_styles } = props;

const { computed_refs, components } = controller;

const { NavLinkUI } = components;

const { wrapper_style, has_items, display_items } = computed_refs;
</script>

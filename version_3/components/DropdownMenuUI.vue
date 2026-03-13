<template>
    <div
        v-if="state_refs.is_open"
        :id="id"
        :class="[class_styles.wrapper_class_style]"
        :style="computed_refs.wrapper_style.value"
    >

        <div :class="class_styles.menu_class_style">

            <div
                v-for="item in menu_items"
                :key="item.id"
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

const {
    id,
    menu_items,
    class_styles
} = props;

const {
    state_refs,
    computed_refs
} = controller;

</script>
<template>
    <nav v-if="has_items" :id="id" :class="class_styles.wrapper_class_style">
        <div :class="class_styles.list_class_style">
            <template v-for="(item, index) in display_items" :key="item?.id ?? index">
                <div :class="class_styles.item_wrapper_class_style">
                    <NavLinkUI v-bind="item" />
                </div>

                <span
                    v-if="index < display_items.length - 1 && separator"
                    :class="class_styles.separator_class_style"
                    v-html="separator"
                ></span>
            </template>
        </div>
    </nav>
</template>

<script setup lang="ts">
import BreadcrumbUIProps from "../props/breadcrumb_ui_props";
import BreadcrumbUIController from "../controllers/breadcrumb_ui_controller";

const props = defineProps(BreadcrumbUIProps);

const controller = new BreadcrumbUIController(props);

const { id, separator, class_styles } = props;

const { computed_refs, components } = controller;

const { NavLinkUI } = components;

const { has_items, display_items } = computed_refs;
</script>

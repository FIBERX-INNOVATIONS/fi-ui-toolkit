<template>
    <div :id="id" :class="class_styles.wrapper_class_style" :style="wrapper_style">
        <div v-if="has_items" :class="class_styles.menu_class_style">
            <div
                v-for="(item, index) in display_items"
                :key="menuItemKey(item, index)"
                :class="class_styles.menu_item_wrapper_class_style"
            >
                <NavLinkUI
                    v-bind="item"
                    :is_children_open="isChildMenuOpen(item, index)"
                    :on_children_toggle="() => toggleChildMenu(item, index)"
                />

                <div
                    v-if="item.children?.length && isChildMenuOpen(item, index)"
                    :id="`${id}-children-${menuItemKey(item, index)}`"
                    :class="class_styles.children_wrapper_class_style"
                >
                    <div
                        v-for="(child, childIndex) in item.children"
                        :key="child.id ?? `${menuItemKey(item, index)}-child-${childIndex}`"
                        class="py-1"
                    >
                        <NavLinkUI v-bind="child" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DropdownMenuUIProps from "../props/dropdown_menu_ui_props";
import DropdownMenuUIController from "../controllers/dropdown_menu_ui_controller";
import { NavLinkUIPropsInterface } from "../ui_types/nav_link_ui_type";

const props = defineProps(DropdownMenuUIProps);

const controller = new DropdownMenuUIController(props);

const open_child_menus = ref<Record<string, boolean>>({});

const menuItemKey = (item: NavLinkUIPropsInterface, index: number): string => {
    return item.id ?? `${index}`;
};

const isChildMenuOpen = (item: NavLinkUIPropsInterface, index: number): boolean => {
    return !!open_child_menus.value[menuItemKey(item, index)];
};

const toggleChildMenu = (item: NavLinkUIPropsInterface, index: number): void => {
    const key = menuItemKey(item, index);

    open_child_menus.value[key] = !open_child_menus.value[key];
};

const { id, class_styles } = props;

const { computed_refs, components } = controller;

const { NavLinkUI } = components;

const { wrapper_style, has_items, display_items } = computed_refs;
</script>

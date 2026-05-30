<template>
    <component
        v-if="props.has_permission"
        :id="props.id"
        :is="component_type"
        :to="route_link"
        :href="anchor_link"
        :target="anchor_target"
        :class="[class_styles.wrapper_class_style, is_active_computed ? class_styles.active_menu_class_style : '']"
        @click="action_handler.handleOnClick($event)"
    >
        <!-- {{ props }} -->
        <div v-if="props.img_src || props.icon" :class="class_styles.icon_img_wrapper_class_style">
            <img
                v-if="props.img_src"
                :src="props.img_src"
                :alt="props.img_alt_text"
                :class="class_styles.icon_img_class_style"
            />

            <span v-else-if="props.icon" v-html="icon_svg" :class="class_styles.icon_img_class_style" />
        </div>

        <div v-if="props.content" :class="class_styles.content_class_style" v-html="props.content"></div>

        <span
            v-if="props.children?.length"
            :class="class_styles.children_caret_class_style"
            @click.stop="handleChildrenToggle"
            :aria-expanded="props.is_children_open"
        >
            <span v-html="childrenCaretIcon" :class="[{ 'rotate-180': props.is_children_open }]" />
        </span>
    </component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import NavLinkUIProps from "../props/nav_link_ui_props";
import NavLinkUIController from "../controllers/nav_link_ui_controller";
import { getSVGIconValue, SVGIconKey } from "../resources/svg_icon_resource";

const props = defineProps(NavLinkUIProps);

const controller = new NavLinkUIController(props);

const { class_styles } = props;

const { computed_refs, action_handler } = controller;

const { component_type, route_link, anchor_link, anchor_target, is_active_computed, icon_svg } = computed_refs;

const handleChildrenToggle = (event: MouseEvent): void => {
    props.on_children_toggle?.(event);
};

const childrenCaretIcon = computed(() => {
    const icon = props.children_caret_icon;
    const defaultIcon = getSVGIconValue(
        props.is_children_open ? "trinagular_caret_up_svg_icon" : "trinagular_caret_down_svg_icon"
    );

    if (!icon) {
        return typeof defaultIcon === "string" ? defaultIcon : "";
    }

    const resolved = getSVGIconValue(icon as SVGIconKey);

    return typeof resolved === "string" && resolved.length ? resolved : (icon as string);
});
</script>

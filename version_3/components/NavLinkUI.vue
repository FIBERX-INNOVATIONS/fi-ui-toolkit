<template>
    <component
        :is="computed_refs.component_type.value"
        :to="computed_refs.route_link.value"
        :href="computed_refs.anchor_link.value"
        :target="computed_refs.anchor_target.value"
        :class="[
            class_styles.wrapper_class_style,
            computed_refs.is_active_computed.value
                ? class_styles.active_menu_class_style
                : ''
        ]"
        @click="action_handler?.handleOnClick?.($event)"
    >

        <div
            v-if="img_src || icon"
            :class="class_styles.icon_img_wrapper_class_style"
        >

        <img
            v-if="img_src"
            :src="img_src"
            :alt="img_alt_text"
            :class="class_styles.icon_img_class_style"
        />

        <span
            v-else-if="icon"
            v-html="computed_refs.icon_svg.value"
            :class="class_styles.icon_img_class_style"
        />

        </div>

        <div
            v-if="content"
            :class="class_styles.content_class_style"
            v-html="content"
        ></div>

    </component>
</template>

<script setup lang="ts">

import NavLinkUIProps from "../props/nav_link_ui_props";
import NavLinkUIController from "../controllers/nav_link_ui_controller";

const props = defineProps(NavLinkUIProps);

const controller = new NavLinkUIController(props);

const {
    class_styles,
    img_src,
    img_alt_text,
    icon,
    content
} = props;

const {
    computed_refs,
    action_handler
} = controller;

</script>
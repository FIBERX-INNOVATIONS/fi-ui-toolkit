<template>
    <component
        v-if="has_permission"
        :id="id"
        :is="component_type"
        :to="route_link"
        :href="anchor_link"
        :target="anchor_target"
        :class="[class_styles.wrapper_class_style, is_active_computed ? class_styles.active_menu_class_style : '']"
        @click="action_handler.handleOnClick($event)"
    >
        <div v-if="img_src || icon" :class="class_styles.icon_img_wrapper_class_style">
            <img v-if="img_src" :src="img_src" :alt="img_alt_text" :class="class_styles.icon_img_class_style" />

            <span v-else-if="icon" v-html="icon_svg" :class="class_styles.icon_img_class_style" />
        </div>

        <div v-if="content" :class="class_styles.content_class_style" v-html="content"></div>
    </component>
</template>

<script setup lang="ts">
import NavLinkUIProps from "../props/nav_link_ui_props";
import NavLinkUIController from "../controllers/nav_link_ui_controller";

const props = defineProps(NavLinkUIProps);

const controller = new NavLinkUIController(props);

const { class_styles, img_src, img_alt_text, icon, content, has_permission, id } = props;

const { computed_refs, action_handler } = controller;

const { component_type, route_link, anchor_link, anchor_target, is_active_computed, icon_svg } = computed_refs;
</script>

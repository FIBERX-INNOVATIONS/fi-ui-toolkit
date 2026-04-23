<template>
    <div :class="class_styles.wrapper_class_style">
        <!-- Prev -->
        <button
            :disabled="is_prev_disabled"
            :class="[button_class(is_prev_disabled), class_styles.prev_btn_class_style]"
            @click="action_handler.handlePageChange(props.data_props.current_page - 1)"
        >
            <span 
                :class="class_styles.btn_icon_class_style"
                v-html="getSVGIconValue(content_props.prev_btn_icon ?? 'less_than_caret_svg_icon')"
            ></span>

            {{ content_props.prev_btn_text }}
        </button>

        <!-- Numbers -->
        <div v-if="config_props.show_numbers" :class="class_styles.page_container_class_style">
            <button
                v-for="p in pages"
                :key="p"
                :disabled="p === '...'"
                :class="[class_styles.button_class_style, p === props.data_props.current_page ? class_styles.active_page_class_style : '']"
                @click="p !== '...' && action_handler.handlePageChange(parseInt(p.toString()))"
            >
                {{ p }}
            </button>
        </div>

        <!-- Next -->
        <button
            :disabled="is_next_disabled"
            :class="[button_class(is_next_disabled), class_styles.next_btn_class_style]"
            @click="action_handler.handlePageChange(props.data_props.current_page + 1)"
        >
            {{ content_props.next_btn_text }}

            <span 
                :class="class_styles.btn_icon_class_style"
                v-html="getSVGIconValue(content_props.next_btn_icon ?? 'greater_than_caret_svg_icon')"
            ></span>
        </button>

    </div>
</template>

<script setup lang="ts">

import PaginationUIProps from "../props/pagination_ui_props";
import PaginationUIController from "../controllers/pagination_ui_controller";
import { getSVGIconValue } from "../resources/svg_icon_resource";

const props = defineProps(PaginationUIProps);
const controller = new PaginationUIController(props);

const { class_styles, content_props, config_props } = props;

const { computed_refs, action_handler } = controller;

const { pages, is_prev_disabled, is_next_disabled } = computed_refs;


const button_class = (disabled: boolean) =>
    `${class_styles.button_class_style} ${disabled ? class_styles.disabled_class_style : ""}`;


</script>
<template>

    <div
        :id="id"
        :class="class_styles.wrapper_class_style"
    >

        <!-- Top Row -->

        <div :class="class_styles.top_row_class_style">

            <!-- Header -->

            <div :class="class_styles.header_wrapper_class_style">

                <HeaderTextUI
                    v-if="header_props"
                    v-bind="header_props"
                />

            </div>

            <!-- Action Buttons -->

            <div
                v-if="computed_refs.has_actions.value"
                :class="class_styles.action_buttons_wrapper_class_style"
            >

                <ButtonUI
                    v-for="(btn,index) in action_buttons"
                    :key="btn?.id ?? index"
                    v-bind="btn"
                />

            </div>

        </div>

            <!-- Description -->

        <div
            v-if="computed_refs.has_description.value"
            :class="class_styles.description_class_style"
            v-html="description_text"
        ></div>

        <slot />

    </div>

</template>


<script setup lang="ts">

import PageHeaderUIProps from "../props/page_header_ui_props";
import PageHeaderUIController from "../controllers/page_header_ui_controller";

const props = defineProps(PageHeaderUIProps);

const controller = new PageHeaderUIController(props);

const {
    id,
    header_props,
    description_text,
    action_buttons,
    class_styles
} = props;

const {
    computed_refs,
    components
} = controller;

const {
    HeaderTextUI,
    ButtonUI
} = components

</script>
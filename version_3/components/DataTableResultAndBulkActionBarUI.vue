<template>
    <div :class="class_styles.wrapper_class_style">

        <!-- LEFT / TEXT -->
        <div
            v-if="isTextLeft"
            :class="class_styles.left_container_class_style"
        >
            <span :class="class_styles.text_class_style">
                {{ computed_header_text }}
            </span>
        </div>

        <!-- RIGHT / BUTTON -->
        <div
            v-if="isTextLeft"
            :class="class_styles.right_container_class_style"
        >
            <ButtonUI
                v-if="show_bulk_button"
                :key="selection_props.selected_count"
                v-bind="selection_props.bulk_button_props"
            />
        </div>

        <!-- REVERSED -->
        <template v-if="!isTextLeft">

            <div :class="class_styles.left_container_class_style">
                <ButtonUI
                    v-if="show_bulk_button"
                    :key="selection_props.selected_count"
                    v-bind="selection_props.bulk_button_props"
                />
            </div>

            <div :class="class_styles.right_container_class_style">
                <span :class="class_styles.text_class_style">
                    {{ computed_header_text }}
                </span>
            </div>

        </template>

    </div>
</template>

<script setup lang="ts">

import DataTableHeaderBarUIProps from "../props/data_table_result_and_bulk_action_bar_ui_props";
import DataTableHeaderBarUIController from "../controllers/data_table_result_and_bulk_action_bar_ui_controller";


const props = defineProps(DataTableHeaderBarUIProps);
const controller = new DataTableHeaderBarUIController(props);

const {
    class_styles,
    layout,
    selection_props
} = props;

const {
    computed_refs,
    components
} = controller;

const { ButtonUI } = components;

const {
    computed_header_text,
    show_bulk_button
} = computed_refs;

const isTextLeft = layout === "text-left";

</script>
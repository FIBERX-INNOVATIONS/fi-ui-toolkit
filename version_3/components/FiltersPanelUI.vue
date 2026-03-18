<template>

    <div :class="class_styles.wrapper_class_style">

        <!-- Toggle Button -->

        <div v-if="toggle_btn_content" :class="class_styles.toggle_btn_wrapper_class_style">

            <button
                type="button"
                @click="action_handler?.togglePanel?.()"
                :class="class_styles.toggle_btn_class_style"
                v-html="toggle_btn_content"
            >
            </button>

        </div>


        <!-- Panel -->
        <div
            v-show="state_refs.is_open.value"
            :class="class_styles.panel_wrapper_class_style"
        >

            <!-- Filters Grid -->

            <div :class="class_styles.filters_grid_class_style">

                <InputGroupUI
                    v-for="(filter,index) in filter_fields"
                    :key="filter.key ?? index"
                    v-bind="filter.input_group_props"
                />

            </div>


            <!-- Actions -->

            <div :class="class_styles.actions_wrapper_class_style">

                <ButtonUI
                    v-if="apply_button"
                    v-bind="apply_button"
                    @click="action_handler?.applyFilters?.()"
                />

                <ButtonUI
                    v-if="clear_button"
                    v-bind="clear_button"
                    @click="action_handler?.clearFilters?.()"
                />

            </div>

        </div>

    </div>

</template>


<script setup lang="ts">

import FiltersPanelUIProps from "../props/filters_panel_ui_props";
import FiltersPanelUIController from "../controllers/filters_panel_ui_controller";

const props = defineProps(FiltersPanelUIProps);

const controller = new FiltersPanelUIController(props);

const {
    toggle_btn_content,
    filter_fields,
    apply_button,
    clear_button,
    class_styles
} = props;

const {
    state_refs,
    action_handler,
    components
} = controller;

const {
    InputGroupUI,
    ButtonUI
 } = components

</script>
<template>
    <div :class="class_styles?.wrapper_class_style">
        <CheckboxInputUI
            v-if="column?.props?.is_selected"
            :id="`CheckBoxSelectInput${record_index?.toString()}`"
            :class_styles="class_styles?.input_ui_class_style"
            :model_value="computed_refs?.input_model_value?.value"
            :content_props="computed_refs?.input_content_props?.value"
            :boolean_props="computed_refs?.input_boolean_props?.value"
            :action_props="computed_refs?.input_action_props?.value"
        />

        <span v-else :class="class_styles?.text_class_style">
            {{ computed_refs?.serial_value?.value }}
        </span>
    </div>
</template>

<script setup lang="ts">
import DataTableSerialCellUIProps from "../../props/data_table_cell_component_ui_props";
import DataTableSerialCellUIController from "../../controllers/data_table_cell_component_ui_controller";

const props = defineProps(DataTableSerialCellUIProps);

const controller = new DataTableSerialCellUIController(props);

const { column } = props;

const { computed_refs, components } = controller;

const { CheckboxInputUI } = components;

const class_styles = column?.props?.class_styles;
</script>
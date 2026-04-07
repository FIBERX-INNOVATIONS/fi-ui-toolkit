<template>
    <div :class="class_styles?.wrapper_class_style">
        <span :class="class_styles?.text_class_style">
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

const { computed_refs } = controller;

const class_styles = column?.props?.class_styles;
</script>
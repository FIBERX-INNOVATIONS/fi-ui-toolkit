<template>
    <div :class="class_styles?.wrapper_class_style">
        <ButtonUI
            :id="`ActionBtn${record_index?.toString()}`"
            type="button"
            :class_styles="class_styles?.button_ui_class_style"
            :content_props="column?.props?.button_content_props?.(record, record_index)"
            :boolean_props="column?.props?.button_ui_boolean_props?.(record, record_index)"
            :action_props="column?.props?.button_action_props?.(record, record_index)"
        />
    </div>
</template>

<script setup lang="ts">
import DataTableSerialCellUIProps from "../../props/data_table_cell_component_ui_props";
import DataTableSerialCellUIController from "../../controllers/data_table_cell_component_ui_controller";

const props = defineProps(DataTableSerialCellUIProps);

const controller = new DataTableSerialCellUIController(props);

const { 
    column,
    record_index,
} = props;

const { 
    computed_refs,
    components
} = controller;

const {
    ButtonUI
} = components


const class_styles = column?.props?.class_styles;
</script>
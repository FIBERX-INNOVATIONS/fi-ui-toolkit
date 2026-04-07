<template>
    <div :class="class_styles?.wrapper_class_style">
        <SwitchInputUI
            :id="record_index?.toString()"
            :switch_btn_id="`${record_index?.toString()}_swicth_id`"
            :class_styles="class_styles?.input_ui_class_style"
            :model_value="computed_refs?.raw_record_value?.value"
            :content_props="column?.props?.input_content_props?.(record)"
            :boolean_props="column?.props?.input_ui_boolean_props?.(record)"
            :action_props="column?.props?.input_action_props?.(record)"
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
    SwitchInputUI

} = components


const class_styles = column?.props?.class_styles;
</script>
<template>
    <div :class="class_styles?.wrapper_class_style">
        <HeaderTextUI
            :header_tag="column?.props?.header_tag"
            :text_value="computed_refs?.text_content?.value"
            :class_styles="class_styles?.text_content_class_style"

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
    HeaderTextUI
} = components


const class_styles = column?.props?.class_styles;
</script>
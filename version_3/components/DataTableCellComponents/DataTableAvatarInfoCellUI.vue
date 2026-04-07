<template>
    <div :class="class_styles?.wrapper_class_style">
        <ImageRenderUI
            :id="record_index?.toString()"
            :class_styles="class_styles?.img_render_ui_class_style"
            :src="computed_refs?.img_src?.value"
            :alt_text="computed_refs?.img_alt_text?.value"
            :content="computed_refs?.img_content?.value"
        >
            <span 
                :class="class_styles?.sub_text_class_style" 
                v-html="computed_refs?.img_sub_text?.value"></span>
        </ImageRenderUI>
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
    ImageRenderUI

} = components;

const class_styles = column?.props?.class_styles;
</script>
<template>
    <div :class="class_styles?.wrapper_class_style">
        <a 
            :href="computed_refs?.link_url?.value"
            target="_blank"
            :class="class_styles?.url_link_class_style?.wrapper_class_style"
        >

            <img 
                v-if="column?.props?.getImgSrc?.(record)"
                :src="computed_refs?.img_src?.value"
                :class="class_styles?.url_link_class_style?.icon_class_style"
                :alt="computed_refs?.img_alt_text?.value"
            />

            <span
                v-else-if="computed_refs?.link_icon?.value" 
                :class="class_styles?.url_link_class_style?.icon_class_style"
                v-html="computed_refs?.link_icon?.value"
            ></span>

            <span 
                :class="class_styles?.url_link_class_style?.text_class_style"
                v-html="computed_refs?.link_text?.value"
            ></span>
        </a>
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


const class_styles = column?.props?.class_styles;
</script>
<template>
    <component
        :is="computed_refs.component_type.value"
        :id="id"
        role="navigation"
        :class="class_styles.wrapper_class_style"
    >

        <!-- section 1 -->
        <div :class="class_styles.section_1_wrapper_class_style">
            <slot name="section_1" />
        </div>

        <!-- section 2 -->
        <div :class="class_styles.section_2_wrapper_class_style">
            <slot name="section_2" />
        </div>

        <!-- section 3 -->
        <div :class="class_styles.section_3_wrapper_class_style">
            <slot name="section_3" />
        </div>

    </component>
</template>

<script setup lang="ts">

import LayoutSectionsUIProps from "../props/layout_sections_ui_props";
import LayoutSectionsUIController from "../controllers/layout_sections_ui_controller";

const props = defineProps(LayoutSectionsUIProps);

const controller = new LayoutSectionsUIController(props);

const {
    id,
    class_styles
} = props;

const {
    computed_refs
} = controller;

</script>
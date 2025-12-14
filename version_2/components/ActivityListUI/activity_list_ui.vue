<template>
    <div :class="wrapper_class_style">
        <div 
            v-for="(record, index) in props.activity_records" 
            :key="props.getRecordId(record) || record?.id || index" 
            :class="activity_wrapper_class_style"
        >
            <!-- Header -->
            <div :class="activity_header_class_style">
                <!-- SELECT MODE CHECKBOX -->
                <div 
                    v-if="select_mode" 
                    :class="select_checkbox_wrapper_class_style"
                >
                    <input
                        v-if="!is_loading" 
                        :id="`activty_${index}`"
                        :name="`activty_${index}`"
                        type="checkbox"
                        :checked="isRecordSelected(record)"
                        @change="handleOnSelected($event, record, index)"
                        :class="select_checkbox_class_style"
                    />

                    <span v-else :class="select_checkbox_class_style" v-html="loader_content_text"></span>
                </div>

                <!-- HEADER SECTION 1 -->
                <div 
                    :class="activity_header_section_1_class_style" 
                    v-html="renderHeaderSection1Content(index, record, activity_records)"
                ></div>

                <!-- HEADER SECTION 2 -->
                <div 
                    :class="activity_header_section_2_class_style" 
                    v-html="renderHeaderSection2Content(index, record, activity_records)"
                ></div>
            </div>

            <!-- Body -->
            <div :class="activity_body_class_style">
                <p 
                    :class="activtiy_body_content_class_style" 
                    v-html="renderBodyContent(index, record, activity_records)"
                ></p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ActivityListUIProps from "./activity_list_ui_props";
import ActivityListUIController from "./activity_list_ui_controller";
import InputTransformerUtil from "../../utils/input_formatter_util";

const props             = defineProps(ActivityListUIProps);
const controller        = new ActivityListUIController(props);
const event_handler     = controller.event_handler;

const { state_refs } = controller.getComponentDefinition();

const {
    isRecordSelected,
    handleOnSelected
} = event_handler;

const { is_loading } = state_refs

const {
    select_mode,

    activity_records,

    wrapper_class_style,

    activity_wrapper_class_style,

    activity_header_class_style,

    activity_header_section_1_class_style,

    activity_header_section_2_class_style,

    activity_body_class_style,

    activtiy_body_content_class_style,

    select_checkbox_wrapper_class_style,

    select_checkbox_class_style,

    loader_content_text,

    renderHeaderSection1Content = (index: number) => { return (index + 1) },

    renderHeaderSection2Content = (_index: number, record: any) => {
        return (InputTransformerUtil.formatReadableDateTime(record?.created_at ?? ""))
    },

    renderBodyContent = (_index: number, record: any) => { return (record?.description ?? "") }

} = props;
</script>

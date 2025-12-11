<template>
    <tbody :class="props.wrapper_class_style">
        <tr 
            v-if="!props.records.length"
            :class="props.body_row_class_style"
        >
            <td
                :class="props.body_cell_class_style" 
                :colspan="props.columns.length + (props.sn_text ? 1 : 0) + (props.actions_text ? 1 : 0)"
                v-html="props.empty_text"
            >  
            </td>
        </tr>

        <tr 
            v-for="(record, index) in props.records" 
            :key="index"
            :class="props.body_row_class_style"
        >
                <td v-if="props.sn_text" :class="props.body_cell_class_style">
                    <input
                        v-if="selected_records.length"
                        :id="`sn-select-${index}`"
                        type="checkbox"
                        :checked="event_handler?.isRecordSelected?.(record) ?? false"
                        @change="event_handler?.handleOnRecordSelect?.($event, record)"
                        :class="props.selected_checkbox_class_style"
                    />
                    <span v-else>{{ index + 1 }}</span>
                </td>

                <!-- <td v-if="props.sn_text" :class="props.body_cell_class_style" >{{ index + 1 }}</td> -->

                <td
                    v-for="(col, col_index) in props.columns"
                    :key="col_index"
                    :class="props.body_cell_class_style" 
                >
                    <!-- Render plain string -->
                    <div v-if="col.content_type === 'plain'" :class="col.col_class_style">
                        {{ transformer_util_ref.getValueByDotPath(record, col?.field_key, "") }}
                    </div>

                    <!-- Render formatted string -->
                    <div 
                        v-else-if="col.content_type === 'formatted'" 
                        :class="col.col_class_style" 
                        v-html="col?.formatter?.(transformer_util_ref.getValueByDotPath(record, col?.field_key, null), record)"
                    ></div>

                    <component 
                        v-else :is="col.component"
                        v-bind="controller.computeComponentRecordProps(col, record)"
                    />
                
                </td>

                <td v-if="props.actions_text" :class="props.body_cell_class_style" >
                    <slot name="actions" :record="record" :record_index="index" />
                </td>
        </tr>
    </tbody>
</template>

<script setup lang="ts">
import TableBodyUIProps         from "./table_body_ui_props";
import TableBodyUIController    from "./table_body_ui_controller";
import InputTransformerUtil     from "../../../utils/input_formatter_util";

const transformer_util_ref      = InputTransformerUtil;
const props                     = defineProps(TableBodyUIProps);
const controller                = new TableBodyUIController(props);
const event_handler             = controller.event_handler;

controller.getComponentDefinition();
</script>

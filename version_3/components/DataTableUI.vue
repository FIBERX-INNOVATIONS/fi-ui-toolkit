<template>
    <section :id="section_id" :class="class_styles.wrapper_class_style">

        <table :id="table_id" :class="class_styles.table_class_style">

            <!-- HEADER -->
            <thead :class="class_styles.thead_class_style">
                <tr>
                    <th
                        v-for="(col, index) in table_render_obj"
                        :key="index"
                        :class="[class_styles.th_class_style, col?.width ? col.width : '']"
                        @click="col.sortable && action_handler?.handleSortDataByCol?.(col.key)"
                    >
                        <div :class="class_styles.th_cell_wrapper_class_style">

                            <template v-for="header_content in [action_handler.getHeaderContent(col)]" :key="col.key">

                                <template v-if="typeof header_content === 'object'">

                                    <component
                                        v-if="header_content"
                                        :is="header_content"
                                        v-bind="{ column: col, record_index: -1 }"
                                    />

                                    <span v-else v-html="header_content" />

                                </template>

                                <span v-else v-html="header_content"></span>

                            </template>

                            <div v-if="col.sortable" :class="class_styles.sortable_header_wrapper_class_style">
                            <span
                                    :class="[
                                        class_styles.sortable_header_icon_class_style,
                                        sort_key === col.key && sort_direction === 'asc'
                                            ? 'opacity-100'
                                            : 'opacity-30'
                                    ]"
                                    v-html="SVGIcons.trinagular_caret_up_svg_icon"
                                >
                                </span>
                                <span
                                    :class="[
                                        class_styles.sortable_header_icon_class_style,
                                        sort_key === col.key && sort_direction === 'desc'
                                            ? 'opacity-100'
                                            : 'opacity-30'
                                    ]"
                                    v-html="SVGIcons.trinagular_caret_down_svg_icon"
                                >
                                </span>
                            </div>
                        </div>
                        
                    </th>
                </tr>
            </thead>

            <!-- BODY -->
            <tbody :class="class_styles.tbody_class_style">
                <!-- LOADER -->
                <tr v-if="props.is_loading">
                    <td
                        :colspan="table_render_obj.length"
                        :class="class_styles?.loading_section_wrapper_class_style"
                    >
                        <div :class="class_styles?.loader_text_wrapper_class_style">
                            <span :class="class_styles?.loader_text_icon_class_style"></span>
                            <span v-html="content?.loader_html_content"></span>
                        </div>

                        <div 
                            v-if="class_styles.loader_skeleton_bar_class_style" 
                            v-for="(_, index) in 12" 
                            :key="index" 
                            :class="class_styles.loader_skeleton_bar_class_style"></div>
                    </td>
                </tr>

                <!-- EMPTY STATE -->
                <tr v-else-if="!props.data || props.data.length === 0">
                    <td
                        :colspan="table_render_obj.length"
                        :class="class_styles?.empty_data_wrapper_class_style"
                    >
                        <span 
                            :class="class_styles?.empty_data_class_style"
                            v-html="content?.empty_data_html_content || 'No data available'"
                        ></span>
                    </td>
                </tr>

                <tr
                    v-else
                    v-for="(row, index) in props.data"
                    :key="row[props.row_key]"
                    :class="class_styles.tr_class_style"
                >
                    <td
                        v-for="(col, i) in props.table_render_obj"
                        :key="i"
                        :class="[class_styles.td_class_style, col?.width ? col.width : '']"
                    >

                        <template v-for="cell_content in [action_handler.getCellContent(col, row, index)]" :key="i">

                            <template v-if="typeof cell_content === 'object'">

                                <component
                                    v-if="cell_content"
                                    :is="cell_content"
                                    v-bind="{ record: row, column: col, record_index: index }"
                                />

                                <span v-else v-html="cell_content" />

                            </template>

                            <span v-else v-html="cell_content">
                            </span>

                        </template>

                    </td>
                </tr>
            </tbody>

        </table>

    </section>
</template>

<script setup lang="ts">
import { DataTableUIProps } from "../props/data_table_ui_props";
import DataTableUIController from "../controllers/data_table_ui_controller";
import { SVGIcons } from "../resources/svg_icon_resource";

const props = defineProps(DataTableUIProps);

const controller = new DataTableUIController(props);

const {
    section_id,
    table_id,
    table_render_obj,
    data,
    class_styles,
    is_loading,
    content
} = props;

const {
    state_refs,
    action_handler
} = controller;

const {
    sort_direction,
    sort_key
} = state_refs
</script>
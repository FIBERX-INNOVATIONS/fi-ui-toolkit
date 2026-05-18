<template>
    <div :class="multi_select_search_class_styles?.wrapper_class_style">
        <!-- Chips -->
        <div :class="multi_select_search_class_styles?.chips_wrapper_class_style">
            <span
                v-for="(item, index) in state_refs?.selected_options?.value"
                :key="index"
                :class="multi_select_search_class_styles?.chip_class_style"
            >
                {{ item.label_text }}

                <button
                    type="button"
                    :class="multi_select_search_class_styles?.chip_btn_class_style"
                    @click="action_handler.handleMultiSelectRemove($event, item)"
                    v-html="getSVGIconValue('x_circile_svg_icon')"
                ></button>
            </span>
        </div>

        <!-- input -->
        <div :class="class_styles.wrapper_class_style">
            <div class="relative w-full">
                <input
                    :id="`${id?.toLowerCase()}_select_search`"
                    :name="`${id?.toLowerCase()}_select_search`"
                    type="text"
                    :class="input_class_style"
                    v-model="search_value"
                    :placeholder="placeholder_text"
                    :required="boolean_props.required"
                    :readonly="boolean_props.read_only"
                    :disabled="boolean_props.disabled"
                    @focus="action_handler?.toggleDropdown(true)"
                    @input="action_handler?.onSearchInput?.($event)"
                />
                <span
                    :class="class_styles.caret_icon_class"
                    v-html="content_props.caret_html_contewnt"
                    @click="action_handler?.toggleDropdown(!is_multi_search_dropdown_open)"
                ></span>
            </div>

            <div
                v-show="is_multi_search_dropdown_open"
                :class="class_styles.dropdown_wrapper_class_style"
                @scroll="action_handler?.handleDropdownScroll?.($event)"
                :key="`${id?.toLowerCase()}_select_search_dropdown`"
                :id="`${id?.toLowerCase()}_select_search_dropdown`"
            >
                <input
                    type="hidden"
                    class="hidden"
                    v-model="input_value"
                    :id="id"
                    :name="id"
                    @input="action_handler?.handleOnInpuChange?.($event)"
                    @change="action_handler?.handleOnInpuChange?.($event)"
                />

                <!-- Options -->
                <ul v-if="state_refs?.record_options?.value?.length" :class="class_styles.options_wrapper_class_style">
                    <li
                        v-for="(option, index) in state_refs.filtered_options.value"
                        :key="index"
                        @click="action_handler.handleMultiSelectAdd($event, option)"
                        :class="class_styles.option_class_style"
                    >
                        <span
                            :class="class_styles.option_content_class_style"
                            v-html="render_option_label?.(option) ?? option.label_text"
                        ></span>
                    </li>
                </ul>

                <!-- No Results -->
                <div
                    v-else-if="!record_options.length && !is_loading"
                    :class="class_styles.options_wrapper_class_style"
                    v-html="content_props?.no_options_html_content"
                ></div>

                <!-- Loader -->
                <div
                    v-if="is_loading"
                    :class="class_styles.options_wrapper_class_style"
                    v-html="content_props?.loader_html_content"
                ></div>
            </div>

            <span v-if="helper_text" :class="class_styles.helper_text_class_style" v-html="helper_text"></span>

            <span v-if="error_text" :class="class_styles.error_text_class_style" v-html="error_text"></span>
        </div>
    </div>
</template>

<script setup lang="ts">
import InputUIProps from "../../props/input_ui_props";
import InputUIController from "../../controllers/input_ui_controller";
import { getSVGIconValue } from "../../resources/svg_icon_resource";
import { computed } from "vue";

const props = defineProps(InputUIProps);
const controller = new InputUIController(props);

const {
    id,
    type,
    placeholder_text,
    helper_text,
    class_styles,
    number_props,
    boolean_props,
    option_props,
    action_props
} = props;

const { render_option_label } = action_props;

const { state_refs, action_handler, computed_refs } = controller;

const { input_value, search_value, error_text, is_multi_search_dropdown_open, record_options, is_loading } = state_refs;

const readonly_class_style = boolean_props.read_only ? class_styles.input_readonly_class_style : "";
const input_class_style = [class_styles.input_class_style, readonly_class_style].join(" ");
const multi_select_search_class_styles = class_styles.multi_select_search_class_styles;
</script>

<template>
    <div :id="id" :class="class_styles.wrapper_class_style">
        <div v-if="has_tabs" :class="class_styles.tabs_list_class_style" role="tablist">
            <button
                v-for="tab_item in display_tab_items"
                :id="getTabButtonId(tab_item)"
                :key="tab_item.tab_key"
                type="button"
                role="tab"
                :aria-selected="isTabActive(tab_item.tab_key)"
                :aria-controls="getTabPanelId(tab_item)"
                :disabled="boolean_props.disabled || tab_item.disabled || is_switching"
                :class="getTabButtonClass(tab_item)"
                @click="action_handler.handleTabClick(tab_item, $event)"
            >
                <span
                    v-if="tab_item.tab_icon && tab_item.icon_position !== 'after'"
                    :class="class_styles.tab_icon_class_style"
                    v-html="getSVGIconValue(tab_item.tab_icon)"
                ></span>

                <span v-if="tab_item.label_text" :class="class_styles.tab_label_class_style">
                    {{ tab_item.label_text }}
                </span>

                <span
                    v-if="tab_item.tab_icon && tab_item.icon_position === 'after'"
                    :class="class_styles.tab_icon_class_style"
                    v-html="getSVGIconValue(tab_item.tab_icon)"
                ></span>
            </button>
        </div>

        <div :class="class_styles.panel_wrapper_class_style">
            <template v-for="tab_item in display_tab_items" :key="`${tab_item.tab_key}_panel`">
                <section
                    v-if="isTabActive(tab_item.tab_key)"
                    :id="getTabPanelId(tab_item)"
                    role="tabpanel"
                    :aria-labelledby="getTabButtonId(tab_item)"
                    :class="class_styles.panel_class_style"
                >
                    <slot :name="getTabSlotName(tab_item)" :tab_item="tab_item" :active_tab_key="active_tab_key"></slot>
                </section>
            </template>

            <p v-if="error_text" :class="class_styles.error_class_style">
                {{ error_text }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getSVGIconValue } from "../resources/svg_icon_resource";

import TabsUIProps from "../props/tabs_ui_props";
import TabsUIController from "../controllers/tabs_ui_controller";

const props = defineProps(TabsUIProps);
const controller = new TabsUIController(props);

const { id, boolean_props, class_styles } = props;

const { state_refs, computed_refs, action_handler } = controller;

const { active_tab_key, is_switching, error_text } = state_refs;

const { display_tab_items, has_tabs } = computed_refs;

const { isTabActive, getTabSlotName, getTabButtonId, getTabPanelId, getTabButtonClass } = controller;
</script>

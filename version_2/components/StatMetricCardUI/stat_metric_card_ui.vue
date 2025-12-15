<template>
    <div :class="wrapper_class_style">
        <!-- Top section -->
        <div :class="top_section_class_style">
            <div v-html="renderTopContent()"></div>
        </div>

        <!-- Middle section -->
        <div :class="middle_section_class_style">
            <!-- Primary metric -->
            <div :class="metic_one_wrapper_class_style">
                <span :class="metric_value_class_style">
                    {{ metric_value }}
                </span>

                <span
                    v-if="metric_suffix"
                    :class="metric_suffix_class_style"
                >
                    {{ metric_suffix }}
                </span>
            </div>
            

            <!-- Divider -->
            <span
                v-if="has_secondary_metric"
                :class="metric_divider_class_style"
            >
                {{ metric_divider }}
            </span>

            <div v-if="has_secondary_metric" :class="metic_two_wrapper_class_style">
                <!-- Secondary metric -->
                <span :class="metric_value_class_style">
                    {{ metric_value_2 }}
                </span>

                <span
                    v-if="has_secondary_metric && metric_suffix_2"
                    :class="metric_suffix_class_style"
                >
                    {{ metric_suffix_2 }}
                </span>
            </div>

        </div>


        <!-- Bottom section -->
        <div :class="bottom_section_class_style">
            <div v-html="renderBottomContent()"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import StatMetricCardUIProps        from "./stat_metric_card_ui_props";
import StatMetricCardUIController   from "./stat_metric_card_ui_controller";

const props                     = defineProps(StatMetricCardUIProps);
const controller                = new StatMetricCardUIController(props);
const event_handler             = controller.event_handler;
const has_secondary_metric      = controller.hasSecondaryMetric;

controller.getComponentDefinition();

const {
    metric_value,
    metric_suffix,

    metric_value_2,
    metric_suffix_2,
    metric_divider,

    renderTopContent,
    renderBottomContent,

    top_link_text,

    wrapper_class_style,
    top_section_class_style,
    middle_section_class_style,
    metric_value_class_style,
    metric_suffix_class_style,
    metric_divider_class_style,
    bottom_section_class_style,
    metic_one_wrapper_class_style,
    metic_two_wrapper_class_style,
} = props;

</script>

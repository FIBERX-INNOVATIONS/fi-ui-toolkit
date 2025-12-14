<template>
    <section id="ConfirmModal" :class="props.wrapper_class_style">
        <div :class="props.content_text_wrapper_class_style">
            <h3 :class="props.content_class_style" v-html="props.question_text"></h3>
        </div>
        <div :class="props.action_btn_wrapper_class_style">
            <ButtonUI v-bind="cancel_btn_props"/>
            <ButtonUI v-bind="confirm_btn_props"/>
        </div>
    </section>
</template>

<script setup lang="ts">
import ConfirmActionUIProps            from "./confirm_action_ui_props";
import ConfirmActionUIController       from "./confirm_action_ui_controller";

const props                         = defineProps(ConfirmActionUIProps);
const controller                    = new ConfirmActionUIController(props);
const { state_refs, components }    = controller.getComponentDefinition();
const { ButtonUI }                  = components;
const {
    cancel_btn_props,
    confirm_btn_props
} = state_refs;
</script>
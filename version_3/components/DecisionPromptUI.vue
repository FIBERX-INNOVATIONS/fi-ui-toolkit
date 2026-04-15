<template>
    <div :class="class_styles.wrapper_class_style">

        <!-- CONTENT -->
        <div :class="class_styles.content_wrapper_class_style">

            <h3
                v-if="content_props?.title_text"
                :class="class_styles.title_class_style"
                v-html="content_props.title_text"
            />

            <p
                v-if="content_props?.message_text"
                :class="class_styles.message_class_style"
                v-html="content_props.message_text"
            />

        </div>

        <!-- ACTIONS -->
        <div :class="class_styles.actions_wrapper_class_style">

            <ButtonUI
                v-bind="cancel_button_props"
            />

            <ButtonUI
                v-bind="confirm_button_props"
            />

        </div>

    </div>
</template>

<script setup lang="ts">
import DecisionPromptUIProps from "../props/decision_prompt_ui_props";
import DecisionPromptUIController from "../controllers/decision_prompt_ui_controller";

const props = defineProps(DecisionPromptUIProps);

const controller = new DecisionPromptUIController(props);

const {
    content_props,
    confirm_button_props,
    cancel_button_props,
    class_styles
} = props;

const {
    action_handler,
    components
} = controller;

const { ButtonUI } = components;
</script>
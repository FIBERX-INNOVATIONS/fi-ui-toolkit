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

            <div v-if="show_reason_input" :class="class_styles.reason_wrapper_class_style">
                <label
                    v-if="content_props?.reason_label_text"
                    :for="reason_input_id"
                    :class="class_styles.reason_label_class_style"
                    v-html="content_props.reason_label_text"
                ></label>

                <textarea
                    :id="reason_input_id"
                    v-model="reason_text"
                    :class="class_styles.reason_input_class_style"
                    :placeholder="content_props?.reason_placeholder_text"
                    :required="boolean_props.reason_required"
                    :disabled="is_processing"
                    @input="action_handler.clearError()"
                ></textarea>

                <p
                    v-if="content_props?.reason_helper_text"
                    :class="class_styles.reason_helper_class_style"
                    v-html="content_props.reason_helper_text"
                ></p>
            </div>
        </div>

        <!-- ACTIONS -->
        <div :class="class_styles.actions_wrapper_class_style">
            <ButtonUI v-bind="display_cancel_button_props" />

            <ButtonUI v-bind="display_confirm_button_props" />
        </div>
    </div>
</template>

<script setup lang="ts">
import DecisionPromptUIProps from "../props/decision_prompt_ui_props";
import DecisionPromptUIController from "../controllers/decision_prompt_ui_controller";
import DecisionPromptUIActionHandler from "../action_handlers/decision_prompt_ui_action_handler";

const props = defineProps(DecisionPromptUIProps);

const controller = new DecisionPromptUIController(props);

const { content_props, boolean_props, class_styles } = props;

const { components, state_refs, computed_refs, action_handler: _action_handler } = controller;

const action_handler = _action_handler as DecisionPromptUIActionHandler;

const { ButtonUI } = components;

const { reason_text } = state_refs;

const { is_processing, show_reason_input, display_confirm_button_props, display_cancel_button_props } = computed_refs;

const reason_input_id = "decision_prompt_reason_text";
</script>

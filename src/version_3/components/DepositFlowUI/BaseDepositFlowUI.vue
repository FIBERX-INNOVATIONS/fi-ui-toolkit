<template>
    <div :class="props.class_styles.flow_wrapper" :aria-busy="is_loading">
        <p v-if="error_text" :class="props.class_styles.error" role="alert">{{ error_text }}</p>

        <p v-if="is_loading" :class="props.class_styles.subtitle" role="status">
            {{ props.content_props.loading_text }}
        </p>

        <ButtonUI v-if="!is_ready && !is_loading" v-bind="retry_button" />

        <template v-if="is_ready">
            <DepositDetailsUI
                v-if="step === DepositFlowUISteps.DETAILS_STEP"
                :key="DepositFlowUISteps.DETAILS_STEP"
                v-bind="step_props"
            />

            <PaymentOptionPickerUI
                v-else-if="step === DepositFlowUISteps.PROVIDER_STEP || step === DepositFlowUISteps.METHOD_STEP"
                :key="step"
                v-bind="step_props"
            />

            <TransactionIntentReviewUI
                v-else-if="step === DepositFlowUISteps.REVIEW_STEP"
                :key="DepositFlowUISteps.REVIEW_STEP"
                v-bind="step_props"
            />
        </template>
    </div>
</template>
<script setup lang="ts">
import { DepositFlowUISteps } from "../../configs/deposit_flow_ui_config";

import DepositFlowUIProps from "../../props/deposit_flow_ui_props";

import DepositFlowUIController from "../../controllers/deposit_flow_ui_controller";

const props = defineProps(DepositFlowUIProps);

const controller = new DepositFlowUIController(props);

const { state_refs, computed_refs, components } = controller.getComponentDefinition();

const { step, is_loading, is_ready, error_text } = state_refs;

const { step_props, retry_button } = computed_refs;

const { ButtonUI, DepositDetailsUI, PaymentOptionPickerUI, TransactionIntentReviewUI } = components;
</script>

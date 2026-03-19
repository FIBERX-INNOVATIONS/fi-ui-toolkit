<template>
    <component
        :is="getInputComponent(props.type)"
        v-bind="props"
    />
</template>

<script setup lang="ts">
import InputUIProps      from "../../props/input_ui_props";
import InputUIController from "../../controllers/input_ui_controller";

const props             = defineProps(InputUIProps);
const controller        = new InputUIController(props);
const { components }    = controller;

const {
    TextInputUI,
    TextAreaInputUI,
    CheckboxInputUI,
    NumberInputUI,
    SelectInputUI,
    SelectSearchInputUI,
    SwitchInputUI,
    OtpInputUI,
    FileInputUI,
    PhoneNumberInputUI,
    SearchInputUI,
    DateInputUI,
    DateRangeInputUI
} = components

// Dynamically map input type to component
const getInputComponent = (type?: string) => {
    switch (type) {
        case "text":
        case "password":
        case "email":
            return TextInputUI;
        case "checkbox":
            return CheckboxInputUI;
        case "otp":
            return OtpInputUI;
        case "switch":
            return SwitchInputUI;
        case "text_area":
        case "textarea":
            return TextAreaInputUI;
        case "select":
            return SelectInputUI;
        case "number":
            return NumberInputUI;
        case "file":
            return FileInputUI;
        case "select_search":
            return SelectSearchInputUI;
        case "phone_number":
            return PhoneNumberInputUI;
        case "search":
            return SearchInputUI;
        case "date":
            return DateInputUI;
        case "date_range":
            return DateRangeInputUI;
        default:
            return TextInputUI;
    }
};
</script>


import "@vuepic/vue-datepicker/dist/main.css";

import { VueDatePicker } from "@vuepic/vue-datepicker";

import { ComputedDefinitionType, WatchersType } from "../types/base_type";

import {
    InputUIPropsInterface,
    InputUIStateDataInterface,
    InputUIComputedDataInterface,
    InputUIComponentsInterface,
    InputValue,
    SelectOptionInterface
} from "../ui_types/input_ui_type";

import BaseController from "../base_classes/base_controller";

import InputValidatorUtil from "../utils/input_validator_util";

import InputUIActionHandler from "../action_handlers/input_ui_action_handler";

import OtpInputUI from "../components/InputUI/OtpInputUI.vue";

import TextInputUI from "../components/InputUI/TextInputUI.vue";

import FileInputUI from "../components/InputUI/FileInputUI.vue";

import DateInputUI from "../components/InputUI/DateInputUI.vue";

import SearchInputUI from "../components/InputUI/SearchInputUI.vue";

import NumberInputUI from "../components/InputUI/NumberInputUI.vue";

import SelectInputUI from "../components/InputUI/SelectInputUI.vue";

import SwitchInputUI from "../components/InputUI/SwitchInputUI.vue";

import TextAreaInputUI from "../components/InputUI/TextAreaInputUI.vue";

import CheckboxInputUI from "../components/InputUI/CheckboxInputUI.vue";

import DateRangeInputUI from "../components/InputUI/DateRangeInputUI.vue";

import PhoneNumberInputUI from "../components/InputUI/PhoneNumberInputUI.vue";

import SelectSearchInputUI from "../components/InputUI/SelectSearchInputUI.vue";

import MultiSelectSearchInputUI from "../components/InputUI/MultiSelectSearchInputUI.vue";

class InputUIController extends BaseController<
    InputUIPropsInterface,
    InputUIStateDataInterface,
    InputUIComputedDataInterface,
    InputUIComponentsInterface
> {
    public action_handler: InputUIActionHandler = new InputUIActionHandler(this);

    constructor(props: InputUIPropsInterface) {
        super("input_ui", props);
        this.getComponentDefinition();
    }

    protected getUIComponents(): InputUIComponentsInterface {
        return {
            TextInputUI,
            TextAreaInputUI,
            CheckboxInputUI,
            NumberInputUI,
            SelectInputUI,
            SelectSearchInputUI,
            SwitchInputUI,
            PhoneNumberInputUI,
            OtpInputUI,
            FileInputUI,
            SearchInputUI,
            DateInputUI,
            DateRangeInputUI,
            VueDatePicker,
            MultiSelectSearchInputUI
        } as InputUIComponentsInterface;
    }

    protected getUIStateData(): InputUIStateDataInterface {
        const input_value = this.resolveModelValue(this.props.model_value ?? null, "");
        const { start_date, end_date } = InputUIActionHandler.toDateRangeObject(input_value);

        return {
            input_value,

            str_input_value: input_value?.toString() ?? "",

            start_date,

            end_date,

            selected_text: this.props.selected_text_prefix
                ? `${this.props.selected_text_prefix ?? ""}: ${this.props.model_value ?? ""}`
                : null,

            error_text: null,

            is_loading: false,

            is_dropdown_open: false,

            is_multi_search_dropdown_open: false,

            record_options: [],

            search_value: null,

            current_page: 1,

            total_pages: 0,

            selected_options: this.props.option_props ?? [],

            filtered_options: []
        };
    }

    protected getUIComputedData(): ComputedDefinitionType<InputUIComputedDataInterface> {
        return {
            has_error: () => !!this.state_refs.error_text.value,

            preview_url: (): string | null => {
                const value = this.state_refs.input_value.value as File | string;

                return this.action_handler.generateFilePreviewURL(value);
            },

            is_image_preview: (): boolean => {
                const { computed_refs, state_refs } = this;

                const preview_url = computed_refs?.preview_url?.value;
                const input_value = state_refs.input_value.value;

                if (!preview_url) return false;

                if (input_value instanceof File) {
                    return input_value.type.startsWith("image/");
                }

                if (typeof input_value === "string") {
                    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(input_value);
                }

                return false;
            },

            file_name: (): string | null => {
                const { computed_refs, state_refs } = this;

                const preview_url = computed_refs?.preview_url?.value;
                const input_value = state_refs.input_value.value;

                if (input_value instanceof File) {
                    return input_value.name;
                }

                if (typeof input_value === "string") {
                    return input_value?.split("/")?.pop() ?? null;
                }

                return "Selected file";
            }
        };
    }

    private resolveModelValue(model_value: InputValue, fallback_value: InputValue): InputValue {
        if (this.props.type === "date_range") {
            return InputUIActionHandler.toDateRangeArray(model_value);
        }

        return model_value ?? fallback_value;
    }

    protected getUIWatchers(): WatchersType<InputUIPropsInterface, InputUIStateDataInterface> {
        return {
            model_value: (new_val) => {
                const input_value = this.resolveModelValue(new_val ?? null, null);

                this.state_refs.input_value.value = input_value;

                if (this.props.type === "date_range") {
                    const { start_date, end_date } = InputUIActionHandler.toDateRangeObject(input_value);

                    this.state_refs.start_date.value = start_date;
                    this.state_refs.end_date.value = end_date;
                }

                if (InputValidatorUtil.isEmpty(new_val)) {
                    this.state_refs.search_value.value = null;
                }
            },

            route: (new_val) => {
                const is_empty_query = Object.keys(new_val.query).length === 0;

                if (is_empty_query) {
                    this.state_refs.input_value.value = null;
                }
            },

            record_options: (new_val: SelectOptionInterface[]) => {
                const selected_values = this.state_refs.selected_options.value.map((o) => o.value);
                const filtered_values = (new_val || []).filter((opt) => !selected_values.includes(opt.value));

                this.state_refs.filtered_options.value = filtered_values;
            },

            selected_options: (new_val: SelectOptionInterface[]) => {
                const selected_values = new_val.map((o) => o.value);
                const filtered_values = (this.state_refs.record_options.value || []).filter(
                    (opt) => !selected_values.includes(opt.value)
                );

                this.state_refs.filtered_options.value = filtered_values;
            }
        };
    }

    protected async handleOnMountedLogic(): Promise<void> {}
}

export default InputUIController;

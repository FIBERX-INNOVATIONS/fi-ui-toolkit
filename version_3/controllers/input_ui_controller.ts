
import InputUIActionHandler from "../action_handlers/input_ui_action_handler";

import BaseController from "../base_classes/base_controller";

import { ComputedDefinitionType, WatchersType } from "../types/base_type";

import {
    InputUIPropsInterface,
    InputUIStateDataInterface,
    InputUIComputedDataInterface,
    InputUIComponentsInterface,
    InputDateRangeValueType
} from "../ui_types/input_ui_type";

import TextInputUI from "../components/InputUI/TextInputUI.vue";
import TextAreaInputUI from "../components/InputUI/TextAreaInputUI.vue";
import CheckboxInputUI from "../components/InputUI/CheckboxInputUI.vue";
import NumberInputUI  from "../components/InputUI/NumberInputUI.vue";
import SelectInputUI from "../components/InputUI/SelectInputUI.vue";
import SelectSearchInputUI from "../components/InputUI/SelectSearchInputUI.vue";
import SwitchInputUI from "../components/InputUI/SwitchInputUI.vue";
import PhoneNumberInputUI from "../components/InputUI/PhoneNumberInputUI.vue";
import OtpInputUI from "../components/InputUI/OtpInputUI.vue";
import FileInputUI from "../components/InputUI/FileInputUI.vue";
import SearchInputUI from "../components/InputUI/SearchInputUI.vue";
import DateInputUI from "../components/InputUI/DateInputUI.vue";
import DateRangeInputUI from "../components/InputUI/DateRangeInputUI.vue";

import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'



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
            VueDatePicker
        } as InputUIComponentsInterface;
    }

    protected getUIStateData(): InputUIStateDataInterface {

        return {
            input_value: this.props.model_value ?? "",

            start_date: (this.props.model_value as InputDateRangeValueType)?.start_date ?? "",

            end_date: (this.props.model_value as InputDateRangeValueType)?.end_date ?? "",

            error_text: null,

            is_loading: false,

            is_dropdown_open: false,

            record_options: [],

            search_value: null,

            current_page: 1,

            total_pages: 0
        };

    }

    protected getUIComputedData(): ComputedDefinitionType<InputUIComputedDataInterface> {

        return {

            has_error: () => !!this.state_refs.error_text,

            preview_url: (): string | null => {
                const value = (this.state_refs.input_value.value) as File | string;

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

    protected getUIWatchers(): WatchersType<InputUIPropsInterface, InputUIStateDataInterface> {
        return {
            model_value: (new_val) => {
                this.state_refs.input_value.value = new_val
            },

            input_value: (new_val) => {
                this.props.action_props?.on_change?.(undefined, new_val, { props: this.props });
            },

            route: (new_val) => {
                const is_empty_query = Object.keys(new_val.query).length === 0;

                if(is_empty_query) {
                    this.state_refs.input_value.value = null;
                }
            },

        };
    }

    protected async handleOnMountedLogic(): Promise<void> {
        
    }

}

export default InputUIController;
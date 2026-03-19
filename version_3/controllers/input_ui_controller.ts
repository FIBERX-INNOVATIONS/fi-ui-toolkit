
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

import "../resources/datepicker.min.css";



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
            DateRangeInputUI
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

            has_error: () => !!this.state_refs.error_text

        };

    }

    protected getUIWatchers(): WatchersType<InputUIPropsInterface, InputUIStateDataInterface> {
        return {
            model_value: (new_val) => {
                console.log({ new_val })
            },
            route: (new_val) => {
                const is_empty_query = Object.keys(new_val.query).length === 0;

                if(is_empty_query) {
                    switch (this.props.type) {
                        case "date_range":
                            this.state_refs.start_date.value = "";
                            this.state_refs.end_date.value  = "";
                            return;
                        default:
                            this.state_refs.input_value.value = null;
                            return;
                    }
                }
            }
        };
    }

    protected async handleOnMountedLogic(): Promise<void> {
        this.action_handler.setUpDatePickerOnDateInput();

        this.action_handler.setUpDateRangePickerOnDateInput();
    }

}

export default InputUIController;
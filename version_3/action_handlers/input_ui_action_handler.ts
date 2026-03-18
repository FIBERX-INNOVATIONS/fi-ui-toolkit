
import BaseController from "../base_classes/base_controller";

import {
    InputUIPropsInterface,
    InputUIStateDataInterface,
    InputUIComputedDataInterface,
    SelectOptionInterface,
    PhoneNumberResultInterface
} from "../ui_types/input_ui_type";


class InputUIActionHandler {

    public controller: BaseController<
        InputUIPropsInterface,
        InputUIStateDataInterface,
        InputUIComputedDataInterface
    >;

    private static instance: InputUIActionHandler;

    constructor(
        controller: BaseController<
            InputUIPropsInterface,
            InputUIStateDataInterface,
            InputUIComputedDataInterface
        >
    ){
        this.controller = controller;
    }


    // Method to Safely resolve input value from event OR DOM fallback
    private resolveInputValue = (event: Event): string => {
        const props     = this.controller?.props;
        const input_id  = props?.id;
        let target      = event.target as HTMLElement | null;

        // Case 1: Direct input/select/textarea
        if (target && 'value' in target) {
            return (target as HTMLInputElement).value;
        }

        // Case 3: Fallback using ID
        if (input_id) {
            const el = document.getElementById(input_id) as HTMLInputElement | null;
            if (el) {
                return el.value;
            }
        }

        // Case 3: Clicked on child (icon, span, button, etc.)
        if (target) {
            const parent_input = target.closest('input, textarea, select') as HTMLInputElement;

            if (parent_input) {
                return parent_input.value;
            }
        }

        return '';
    };

    // Method to Detect clicks outside the  input dropdown container.
    private handleOutsideClick = (event: MouseEvent) => {
        const props             = this.controller?.props;
        const input_id          = props.id;
        const dropdown_id       = `${input_id?.toLowerCase()}_select_search_dropdown`;
        const drodpdown_el      = document.getElementById(dropdown_id);
        const dropdown_wrapper  = drodpdown_el?.closest(".relative");

        // If clicked outside the component → close dropdown
        if (
            dropdown_wrapper && 
            !dropdown_wrapper.contains(event.target as Node)
        ) {
            this.controller.state_refs.is_dropdown_open.value = false
            document.removeEventListener("click", this.handleOutsideClick);
        }
    };

    // Method to Detect clicks outside the  input dropdown container.
    private fetchRecordOptions = async () => {
        try {
            const props                     = this.controller?.props;
            const state_refs                = this.controller?.state_refs;
            const record_options            = state_refs.record_options.value;
            const current_page              = state_refs.current_page.value;
            const search_value              = state_refs.search_value.value;
            const { fetch_data_method }     = props?.action_props || {};

            if(props.boolean_props?.read_only || !fetch_data_method) { return }

            this.controller.state_refs.is_loading.value  = true;

            const params                    = { page: current_page, search: search_value }
            const { records, total_pages }  = await fetch_data_method(params);
            const updated_record_opts       = [...record_options, ...records];

            this.controller.state_refs.total_pages.value     = total_pages;
            this.controller.state_refs.record_options.value  = updated_record_opts;
            return;
        } 
        catch (error) {
            console.error(`[${this.controller.name}] fetchRecordOptions error:`, error);
        } 
        finally {
            this.controller.state_refs.is_loading.value = false;
        }
    };

    private setErrorMsg = (status: boolean, msg: string) => {
        if(!status && msg) {
            this.controller.state_refs.error_text.value = msg;
        }
        else {
            this.controller.state_refs.error_text.value = null;
        }
        
    }

    // Method to handle on input chnage Action
    public handleOnInpuChange = async (event: Event) => {

        const input_value   = this.resolveInputValue(event);
        const props         = this.controller?.props;
        const { on_change } = props?.action_props || {};

        this.controller.state_refs.input_value.value = input_value;

        if(!on_change) { return }

        const { status, msg } = await on_change(event, input_value, { props });

        this.setErrorMsg(status, msg);
        
    }

    // Method to handle on key up action
    public handleOnKeyup = async (event: KeyboardEvent) => {

        const input_value   = this.resolveInputValue(event);
        const props         = this.controller?.props;
        const { on_key_up } = props?.action_props || {};

        if(!on_key_up) { return }

        const { status, msg } = await on_key_up(event, input_value, { props });

        this.setErrorMsg(status, msg);
    }

    // Method to handle on key down action
    public handleOnKeydown = async (event: KeyboardEvent) => {

        const input_value   = this.resolveInputValue(event);
        const props         = this.controller?.props;
        const { on_key_down } = props?.action_props || {};

        this.controller.state_refs.input_value.value = input_value;

        if(!on_key_down) { return }

        const { status, msg } = await on_key_down(event, input_value, { props });

        this.setErrorMsg(status, msg);
    }

    // Method to handle on click action
    public handleOnClick = async (event: MouseEvent) => {
        const props         = this.controller?.props;
        const { on_click }  = props?.action_props || {};
        const input_value   = this.resolveInputValue(event);
       
        this.controller.state_refs.input_value.value = input_value;

        if(!on_click) { return }

        const { status, msg } = await on_click(event, input_value, { props });

        this.setErrorMsg(status, msg);
    }

    // Method to handle on sitch btn toggle
    public handleOnSwitchToggle = async (event: MouseEvent) => {
        try {
            const props         = this.controller?.props;
            const state_refs    = this.controller?.state_refs;
            const { on_click }  = props?.action_props || {};
            const new_value     = !state_refs.input_value.value;

            this.controller.state_refs.is_loading.value      = true;
            this.controller.state_refs.input_value.value     = new_value;

            if(!on_click) { return }

            const { status, msg } = await on_click(event, new_value, { props });

            this.setErrorMsg(status, msg);

            this.controller.state_refs.is_loading.value      = false;
            this.controller.state_refs.input_value.value     = !new_value;
        }
        catch (error) {
            console.error(`[${this.controller.name}] handleOnClick error:`, error);
        } 
        finally {
            this.controller.state_refs.is_loading.value = false;
        }
    }

    // Method to handle toggle dropdown
    public toggleDropdown  = (is_open_value: boolean) => {
        try {
            const props             = this.controller?.props;
            const state_refs        = this.controller?.state_refs;
            const record_options    = state_refs.record_options.value;

            if(props.boolean_props?.read_only) { return }

            const trigger   = `${props.id?.toLowerCase()}_select_search`;
            const menu      = `${props.id?.toLowerCase()}_select_search_dropdown`;

            this.controller.state_refs.is_loading.value          = true;
            this.controller.state_refs.is_dropdown_open.value    = is_open_value;

            if (is_open_value) {
                document.addEventListener("click", this.handleOutsideClick);
                
                if (!record_options.length) { this.fetchRecordOptions(); }
            } 
            else { document.removeEventListener("click", this.handleOutsideClick); }
        }
        catch (error) {
            console.error(`[${this.controller.name}] toggleDropdown error:`, error);
        } 
        finally {
            this.controller.state_refs.is_loading.value = false;
        }
    }

    // Method to handle on search input update
    public onSearchInput = (event: Event) => {
        const props             = this.controller?.props;

        if(props.boolean_props?.read_only) { return }

        const search_value      = this.resolveInputValue(event);
        const is_dropdown_open  = !!search_value?.length;

        this.controller.state_refs.search_value.value          = search_value;
        this.controller.state_refs.is_dropdown_open.value      = is_dropdown_open;

        this.fetchRecordOptions();
        return;
    }

    // Methos to handle on drodpown scroll
    public handleDropdownScroll = (event: Event) => {
        const props             = this.controller?.props;
        const state_refs        = this.controller?.state_refs;
        const current_page      = state_refs.current_page.value;
        const total_pages       = state_refs.total_pages.value;

        const target_el                 = (event.target as HTMLElement);
        const has_scrolled_to_bottom    = target_el.scrollTop + target_el.clientHeight >= target_el.scrollHeight - 5;
        const has_unfetched_pages       = current_page < total_pages

        if ( has_scrolled_to_bottom && has_unfetched_pages) {
            this.controller.state_refs.current_page.value = current_page + 1;
            this.fetchRecordOptions();
        }
    }

    // Methos to handle on drodpown scroll
    public handleRecordOptionSelected = (
        event: Event,
        option: SelectOptionInterface
    ) => {
        this.controller.state_refs.input_value.value         = option.value;
        this.controller.state_refs.is_dropdown_open.value    = false;
        this.controller.state_refs.search_value.value        = option.label_text
    }

    // Method to handle on phone number input chnage
    public handleOnPhoneNumberInpuChange = async (
        phone_number: string, 
        result_options: PhoneNumberResultInterface
    ) => {
        if(!result_options?.number) { return }

        const input_value   = result_options.number;
        const props         = this.controller?.props;
        const { on_change } = props?.action_props || {};

        this.controller.state_refs.input_value.value = input_value;

        if(!on_change) { return }

        const { status, msg } = await on_change(undefined, input_value, { props });

        this.setErrorMsg(status, msg);
    }

    // Method to handle on otp paste
    public handleOnOTPPaste = async (event: ClipboardEvent, index: number) => {
        const props         = this.controller.props;
        const otp_length    = props.number_props?.length;
        const pasted        = event.clipboardData?.getData("text").slice(0, otp_length) || "";
        const next_input_id = `${props.id}_${pasted.length - 1}`;
        const new_value     = Array(otp_length).fill("");
        const { on_change } = props?.action_props || {};

        [...pasted].forEach((char, i) => (new_value[i] = char));

        this.controller.state_refs.input_value.value = new_value;

        const next_input = document.getElementById(next_input_id) as HTMLInputElement;
        next_input?.focus();

        if(!on_change) { return }

        const { status, msg } = await on_change(event, new_value, { props });

        this.setErrorMsg(status, msg);
    }

    // Method to handle on otp input change
    public handleOnOTPInput = async (event: InputEvent, index: number) => {
        const input_value       = this.resolveInputValue(event)?.slice(-1);
        const props             = this.controller.props;
        const state_refs        = this.controller.state_refs;
        const next_input_id     = `${props.id}_${index + 1}`;
        const existing_value    = [...(state_refs.input_value.value as string[])];
        const { on_change }     = props?.action_props || {};
        existing_value[index]   = input_value;

        this.controller.state_refs.input_value.value = existing_value;

        if(!input_value) { return }

        const next_input = document.getElementById(next_input_id) as HTMLInputElement;
        next_input?.focus();

        if(!on_change) { return }

        const { status, msg } = await on_change(event, existing_value.join(""), { props });

        this.setErrorMsg(status, msg);
    }

    // Method to handle on otp input key down
    public handleOnOTPKeydown = async (event: KeyboardEvent, index: number) => {
        const target            = event.target as HTMLInputElement;
        const props             = this.controller.props;
        const state_refs        = this.controller.state_refs;
        const { on_key_down }   = props?.action_props || {};
        const existing_value    = [...(state_refs.input_value.value as string[])];

        if (event.key === "Backspace") {
            event.preventDefault();

            if (target.value) {
                existing_value[index] = "";
                target.value = "";
            } 
            else {
                // Move focus to previous input
                const prev_input_id = `${props.id}_${index - 1}`;
                const prev_input    = document.getElementById(prev_input_id) as HTMLInputElement;

                if (prev_input) {
                    prev_input.focus();
                    existing_value[index - 1] = "";
                    prev_input.value = "";
                }
            }

        }
        else {
            const input_value       = this.resolveInputValue(event)?.slice(-1);
            existing_value[index]   =  input_value;

        }

        this.controller.state_refs.input_value.value = existing_value;

        if(!on_key_down) { return }

        const input_value       = this.resolveInputValue(event)?.slice(-1);
        const { status, msg }   = await on_key_down(event, input_value, { props });

        this.setErrorMsg(status, msg);
    }
}

export default InputUIActionHandler;
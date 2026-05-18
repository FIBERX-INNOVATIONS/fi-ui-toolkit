import BaseActionHandler from "../base_classes/base_action_handler";
import BaseController from "../base_classes/base_controller";

import {
    InputUIComputedDataInterface,
    InputUIComponentsInterface,
    InputUIPropsInterface,
    InputUIStateDataInterface,
    InputValue,
    PhoneNumberResultInterface,
    SelectOptionInterface
} from "../ui_types/input_ui_type";

import InputTransformerUtil from "../utils/input_transformer_util";

type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

class InputUIActionHandler extends BaseActionHandler<
    InputUIPropsInterface,
    InputUIStateDataInterface,
    InputUIComputedDataInterface,
    InputUIComponentsInterface
> {
    private file_preview_url_cache: WeakMap<File, string> = new WeakMap();

    constructor(
        controller: BaseController<
            InputUIPropsInterface,
            InputUIStateDataInterface,
            InputUIComputedDataInterface,
            InputUIComponentsInterface
        >
    ) {
        super(controller);
    }

    private transformValue = (value: any, input_type = this.props.type): InputValue => {
        if (value === "" || value === null || value === undefined) {
            return null;
        }

        if (input_type === "number") {
            const parsed = Number(value);
            return Number.isNaN(parsed) ? null : parsed;
        }

        return value;
    };

    private isEvent(value: unknown): value is Event {
        return typeof Event !== "undefined" && value instanceof Event;
    }

    private resolveInputElement = (params: { target?: HTMLElement | null; input_id?: string }): InputElement | null => {
        const { target, input_id } = params;

        if (target && "value" in target) {
            return target as InputElement;
        }

        if (target) {
            return target.closest("input, textarea, select") as InputElement | null;
        }

        if (input_id) {
            return document.getElementById(input_id) as InputElement | null;
        }

        return null;
    };

    private resolveInputValue = (payload?: Event | InputValue): InputValue => {
        if (!this.isEvent(payload)) {
            return this.transformValue(payload);
        }

        const input = this.resolveInputElement({
            target: payload.target as HTMLElement | null,
            input_id: this.props.id
        });

        if (!input) {
            return null;
        }

        if (input instanceof HTMLInputElement && input.type === "file") {
            if (!input.files || input.files.length === 0) {
                return this.props.file_props?.multiple ? [] : null;
            }

            return this.props.file_props?.multiple ? Array.from(input.files) : input.files[0];
        }

        if (input instanceof HTMLInputElement && input.type === "checkbox") {
            return input.checked;
        }

        return this.transformValue(input.value);
    };

    private handleOutsideClick = (event: MouseEvent): void => {
        const input_id = this.props.id;
        const dropdown_id = `${input_id?.toLowerCase()}_select_search_dropdown`;
        const dropdown_el = document.getElementById(dropdown_id);
        const dropdown_wrapper = dropdown_el?.closest(".relative");
        const contains_target =
            dropdown_wrapper?.contains(event.target as Node) || dropdown_el?.contains(event.target as Node);

        if (dropdown_wrapper && !contains_target) {
            this.setState("is_dropdown_open", false);
            this.setState("is_multi_search_dropdown_open", false);
            document.removeEventListener("click", this.handleOutsideClick);
        }
    };

    private syncFilteredOptions = (): void => {
        const selected_values = this.state_refs.selected_options.value.map((option) => option.value);

        this.setState(
            "filtered_options",
            (this.state_refs.record_options.value || []).filter((option) => !selected_values.includes(option.value))
        );
    };

    private fetchRecordOptions = async (append = false): Promise<void> => {
        await this.runWithLoading("is_loading", async () => {
            const { fetch_data_method } = this.props.action_props || {};

            if (this.props.boolean_props?.read_only || !fetch_data_method) {
                return;
            }

            const current_page = this.state_refs.current_page.value;
            const search_value = this.state_refs.search_value.value;
            const record_options = this.state_refs.record_options.value;
            const params = { page: current_page, search: search_value };
            const { records, total_pages } = await fetch_data_method(params);

            this.setState("total_pages", total_pages);
            this.setState("record_options", append ? [...record_options, ...records] : records);

            this.syncFilteredOptions();
        });
    };

    private commitInputValue = async (event: Event | undefined, input_value: InputValue): Promise<void> => {
        this.setState("input_value", input_value);

        const { on_change } = this.props.action_props || {};

        if (!on_change) {
            this.setErrorMessage(true);
            return;
        }

        const result = await this.invokeAction(on_change, event, input_value, { props: this.props });

        this.setErrorFromResult(result);
    };

    public handleOnInputChange = async (event: Event): Promise<void> => {
        if (this.props.boolean_props?.read_only) {
            return;
        }

        await this.commitInputValue(event, this.resolveInputValue(event));
    };

    public handleOnInpuChange = this.handleOnInputChange;

    public handleOnFileInputChange = async (event: Event): Promise<void> => {
        await this.handleOnInputChange(event);
    };

    public handleOnFileInpuChange = this.handleOnFileInputChange;

    public handleOnKeyup = async (event: KeyboardEvent): Promise<void> => {
        const { on_key_up } = this.props.action_props || {};

        if (!on_key_up) {
            return;
        }

        const result = await this.invokeAction(on_key_up, event, this.resolveInputValue(event), { props: this.props });

        this.setErrorFromResult(result);
    };

    public handleOnKeydown = async (event: KeyboardEvent): Promise<void> => {
        const input_value = this.resolveInputValue(event);

        this.setState("input_value", input_value);

        const { on_key_down } = this.props.action_props || {};

        if (!on_key_down) {
            return;
        }

        const result = await this.invokeAction(on_key_down, event, input_value, { props: this.props });

        this.setErrorFromResult(result);
    };

    public handleOnClick = async (event: MouseEvent): Promise<void> => {
        const { on_click } = this.props.action_props || {};
        const new_value = this.resolveInputValue(event);
        const current_value = InputTransformerUtil.resolveTypedValue(this.state_refs.input_value.value);

        if (!on_click) {
            this.setState("input_value", new_value);
            return;
        }

        await this.runWithLoading("is_loading", async () => {
            const result = await this.invokeAction(on_click, event, new_value, { props: this.props });

            if (result && !result.status && result.msg) {
                this.setState("input_value", current_value as InputValue);
                this.setErrorFromResult(result);
                return;
            }

            this.setState("input_value", new_value);
            this.setErrorFromResult(result);
        });
    };

    public handleOnSwitchToggle = async (event: MouseEvent): Promise<void> => {
        const { on_click } = this.props.action_props || {};
        const new_value = !InputTransformerUtil.resolveTypedValue(this.state_refs.input_value.value);

        if (!on_click) {
            this.setState("input_value", new_value);
            return;
        }

        await this.runWithLoading("is_loading", async () => {
            const result = await this.invokeAction(on_click, event, new_value, { props: this.props });

            if (result && !result.status && result.msg) {
                this.setErrorFromResult(result);
                return;
            }

            this.setState("input_value", new_value);
            this.setErrorFromResult(result);
        });
    };

    public toggleDropdown = (is_open_value: boolean): void => {
        if (this.props.boolean_props?.read_only) {
            return;
        }

        if (this.props.type === "select_search") {
            this.setState("is_dropdown_open", is_open_value);
        } else {
            this.setState("is_multi_search_dropdown_open", is_open_value);
        }

        if (is_open_value) {
            document.addEventListener("click", this.handleOutsideClick);

            if (!this.state_refs.record_options.value.length) {
                void this.fetchRecordOptions();
            }
        } else {
            document.removeEventListener("click", this.handleOutsideClick);
        }
    };

    public onSearchInput = (event: Event): void => {
        if (this.props.boolean_props?.read_only) {
            return;
        }

        const search_value = this.resolveInputValue(event) as string | null;
        const is_dropdown_open = !!search_value?.length;

        this.setState("search_value", search_value);
        this.setState("current_page", 1);

        if (this.props.type === "select_search") {
            this.setState("is_dropdown_open", is_dropdown_open);
        } else {
            this.setState("is_multi_search_dropdown_open", is_dropdown_open);
        }

        void this.fetchRecordOptions();
    };

    public handleDropdownScroll = (event: Event): void => {
        const current_page = this.state_refs.current_page.value;
        const total_pages = this.state_refs.total_pages.value;
        const target_el = event.target as HTMLElement;
        const has_scrolled_to_bottom = target_el.scrollTop + target_el.clientHeight >= target_el.scrollHeight - 5;

        if (has_scrolled_to_bottom && current_page < total_pages) {
            this.setState("current_page", current_page + 1);
            void this.fetchRecordOptions(true);
        }
    };

    public handleRecordOptionSelected = async (event: Event, option: SelectOptionInterface): Promise<void> => {
        const selected_text = this.props.selected_text_prefix
            ? `${this.props.selected_text_prefix}: ${option.label_text ?? ""}`
            : null;

        this.setState("is_dropdown_open", false);
        this.setState("search_value", option.label_text);
        this.setState("selected_text", selected_text);

        await this.commitInputValue(event, option.value);
    };

    public handleOnPhoneNumberInputChange = async (
        phone_number: string,
        result_options: PhoneNumberResultInterface
    ): Promise<void> => {
        if (!result_options?.number) {
            return;
        }

        await this.commitInputValue(undefined, result_options.number);
    };

    public handleOnPhoneNumberInpuChange = this.handleOnPhoneNumberInputChange;

    public handleOnOTPPaste = async (event: ClipboardEvent, index: number): Promise<void> => {
        const otp_length = this.props.number_props?.length ?? 0;
        const pasted = event.clipboardData?.getData("text").slice(0, otp_length) || "";
        const new_value = Array(otp_length).fill("");

        [...pasted].forEach((char, i) => (new_value[i] = char));

        this.setState("input_value", new_value);

        const next_input = document.getElementById(`${this.props.id}_${pasted.length - 1}`) as HTMLInputElement;
        next_input?.focus();

        const { on_change } = this.props.action_props || {};

        if (!on_change) {
            return;
        }

        const result = await this.invokeAction(on_change, event, new_value.join(""), { props: this.props });

        this.setErrorFromResult(result);
    };

    public handleOnOTPInput = async (event: InputEvent, index: number): Promise<void> => {
        const raw_value = this.resolveInputValue(event)?.toString() ?? "";
        const input_value = raw_value.slice(-1);
        const existing_value = [...((this.state_refs.input_value.value as string[]) || [])];

        existing_value[index] = input_value;
        this.setState("input_value", existing_value);

        if (input_value) {
            const next_input = document.getElementById(`${this.props.id}_${index + 1}`) as HTMLInputElement;
            next_input?.focus();
        }

        const { on_change } = this.props.action_props || {};

        if (!on_change) {
            return;
        }

        const result = await this.invokeAction(on_change, event, existing_value.join(""), { props: this.props });

        this.setErrorFromResult(result);
    };

    public handleOnOTPKeydown = async (event: KeyboardEvent, index: number): Promise<void> => {
        const target = event.target as HTMLInputElement;
        const existing_value = [...((this.state_refs.input_value.value as string[]) || [])];

        if (event.key === "Backspace") {
            event.preventDefault();

            if (target.value) {
                existing_value[index] = "";
                target.value = "";
            } else {
                const prev_input = document.getElementById(`${this.props.id}_${index - 1}`) as HTMLInputElement;

                if (prev_input) {
                    prev_input.focus();
                    existing_value[index - 1] = "";
                    prev_input.value = "";
                }
            }
        }

        this.setState("input_value", existing_value);

        const { on_key_down } = this.props.action_props || {};

        if (!on_key_down) {
            return;
        }

        const result = await this.invokeAction(on_key_down, event, existing_value.join(""), { props: this.props });

        this.setErrorFromResult(result);
    };

    public generateFilePreviewURL = (file_value: File | string): string | null => {
        if (!file_value) {
            return null;
        }

        if (file_value instanceof File) {
            const cached_url = this.file_preview_url_cache.get(file_value);

            if (cached_url) {
                return cached_url;
            }

            const preview_url = URL.createObjectURL(file_value);
            this.file_preview_url_cache.set(file_value, preview_url);

            return preview_url;
        }

        if (typeof file_value === "string") {
            return file_value;
        }

        return null;
    };

    public handleMultiSelectAdd = async (event: Event, option: SelectOptionInterface): Promise<void> => {
        const selected = this.state_refs.selected_options.value;

        if (selected.find((item) => item.value === option.value)) {
            return;
        }

        const updated = [...selected, option];

        this.setState("selected_options", updated);
        this.setState("search_value", null);
        this.syncFilteredOptions();

        await this.commitInputValue(
            event,
            updated.map((item) => item.value)
        );
    };

    public handleMultiSelectRemove = async (event: MouseEvent, option: SelectOptionInterface): Promise<void> => {
        const updated = this.state_refs.selected_options.value.filter((item) => item.value !== option.value);

        this.setState("selected_options", updated);
        this.syncFilteredOptions();

        await this.commitInputValue(
            event,
            updated.map((item) => item.value)
        );
    };
}

export default InputUIActionHandler;

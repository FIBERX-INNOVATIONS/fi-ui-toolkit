import FieldValidator from "../validators/withdrawal_recipient_field_validator";

import type {
    RecipientFieldKeyType,
    RecipientValidationResultInterface
} from "../types/withdrawal_recipient_form_type";

import type {
    RecipientFormUIPropsInterface as Props,
    RecipientFormStateInterface as State,
    RecipientFormComputedInterface as Computed,
    RecipientFormComponentsInterface as Components
} from "../ui_types/withdrawal_recipient_form_ui_type";

import RenderHtmlUtil from "../utils/render_html_util";

import Util from "../utils/withdrawal_recipient_form_util";

import InputValidatorUtil from "../utils/input_validator_util";

import BaseActionHandler from "../base_classes/base_action_handler";

import type Controller from "../controllers/withdrawal_recipient_form_ui_controller";

class WithdrawalRecipientFormUIActionHandler extends BaseActionHandler<Props, State, Computed, Components> {
    protected override controller: Controller;
    // Identifies the latest currency-loading attempt so older responses cannot replace it.
    private request_id = 0;
    // Identifies the latest validation pass so an older async validator cannot overwrite newer input errors.
    private validation_version = 0;
    // Prevents asynchronous work from updating a form that has already been closed.
    private is_disposed = false;
    // Debounce timer: waits briefly after typing before starting an account-name lookup.
    private resolution_timer: ReturnType<typeof setTimeout> | undefined;
    // Changes whenever destination details change, making earlier lookup results obsolete.
    private resolution_version = 0;
    // Tracks an actual request in flight; only one host resolver request runs at a time.
    private resolution_running = false;
    // Remembers that the newest destination needs a lookup once the current request finishes.
    private resolution_pending = false;

    // Method to connect reusable form state to its controller.
    constructor(controller: Controller) {
        super(controller);
        this.controller = controller;
    }

    // Method to identify the exact destination associated with a lookup result.
    private resolutionKey(): string {
        const values = this.state_refs.values.value;

        const config = this.controller.computed_refs.profile.value?.account_resolution;

        // Capture the settings and destination together so a result is accepted only for this exact combination.
        return JSON.stringify([
            config,
            values.currency_id,
            values[config?.bank_identifier ?? "bank_code"],
            values.account_number,
            values.bank_account_scope,
            values.account_holder_type
        ]);
    }

    // Method to populate a provider-compatible bank list through the host adapter.
    private async loadBanks(): Promise<void> {
        this.setState("banks", []);
        this.setState("lookup_error_text", "");

        // Only fields with the banks source need a directory; manual bank-name inputs skip this request.
        if (
            !this.controller.computed_refs.fields.value.some((field) => {
                return field.source === "banks";
            })
        ) {
            return;
        }

        if (!this.props.action_props.load_banks) {
            this.setState("lookup_error_text", this.controller.getContentTextValue("lookup_unavailable_text"));

            return;
        }

        const currency = this.state_refs.values.value.currency_id ?? "";

        this.setState("is_banks_loading", true);

        try {
            const banks = await this.props.action_props.load_banks(currency);

            // Ignore the directory if the form closed or the selected currency changed while loading.
            if (!this.is_disposed && currency === this.state_refs.values.value.currency_id) {
                this.setState("banks", banks);
            }
        } catch {
            if (!this.is_disposed) {
                this.setState("lookup_error_text", this.controller.getContentTextValue("lookup_failed_text"));
            }
        } finally {
            if (!this.is_disposed) {
                this.setState("is_banks_loading", false);
            }
        }
    }

    // Method to cancel pending work and invalidate results before any destination change.
    private invalidateResolution(): void {
        // Cancel a scheduled lookup and invalidate any request already in flight.
        // The network request itself may still finish, but its old version will no longer be accepted.
        clearTimeout(this.resolution_timer);
        this.resolution_version += 1;
        this.resolution_pending = false;
        this.setState("is_resolving", false);
        this.setState("resolution_error_text", "");
        this.setState("resolved_key", "");
    }

    // Method to check the configured identifier and exact account digit threshold.
    private canResolve(): boolean {
        const config = this.controller.computed_refs.profile.value?.account_resolution;

        const values = this.state_refs.values.value;

        if (
            this.is_disposed ||
            !config?.enabled ||
            !this.controller.computed_refs.details_ready.value ||
            !this.hasDestinationChange()
        ) {
            return false;
        }

        const account_number = values.account_number?.trim() ?? "";

        const bank_identifier = values[config.bank_identifier]?.trim();

        // Check only the identifier and account-number rules needed for lookup.
        // Other required form fields can still be incomplete at this stage.
        const fields = this.controller.computed_refs.fields.value.filter((field) => {
            return field.key === config.bank_identifier || field.key === "account_number";
        });

        return (
            !!bank_identifier &&
            InputValidatorUtil.isDigit(account_number) &&
            account_number.length === config.account_number_digits &&
            // An empty stored-field list requires actual entered values; masked saved details cannot resolve a name.
            Util.validateFormFields(values, fields, [])
        );
    }

    // Method to debounce automatic lookup while keeping bank and account inputs editable.
    private scheduleResolution(): void {
        if (!this.canResolve()) {
            return;
        }

        // Show inline loading during both the debounce delay and the eventual request.
        this.setState("is_resolving", true);

        const delay = this.controller.computed_refs.profile.value?.account_resolution?.debounce_ms ?? 350;

        this.resolution_timer = setTimeout(
            () => {
                void this.resolve();
            },
            Math.max(0, delay)
        );
    }

    // Method to show errors only after the user has interacted with an input.
    public getFieldError(key: RecipientFieldKeyType): string {
        // Untouched inputs still affect submit eligibility, but do not show an error before interaction.
        return this.state_refs.touched_fields.value[key]
            ? (this.state_refs.validation_results.value[key]?.msg ?? "")
            : "";
    }

    // Method to keep review/save disabled until active inputs and resolution are valid.
    public canSubmit(): boolean {
        // Wait for the required form selections and any pending validation or account-name lookup.
        if (
            this.is_disposed ||
            this.state_refs.is_validating.value ||
            this.state_refs.is_resolving.value ||
            !this.controller.computed_refs.details_ready.value
        ) {
            return false;
        }

        // Every currently active input needs a successful result, including inputs not yet touched.
        if (
            !this.controller.computed_refs.validation_fields.value.every((field) => {
                return this.state_refs.validation_results.value[field.key]?.status === true;
            })
        ) {
            return false;
        }

        // A previously resolved name is valid only for the current bank/account combination.
        if (
            this.controller.computed_refs.needs_resolution.value &&
            this.state_refs.resolved_key.value !== this.resolutionKey()
        ) {
            return false;
        }

        // Require a usable payload after applying the create/edit rules for saved destination fields.
        return (
            Object.keys(
                Util.buildFormPayload(
                    this.state_refs.values.value,
                    this.props.initial_values,
                    this.controller.computed_refs.fields.value,
                    this.props.mode === "edit"
                )
            ).length > 0
        );
    }

    // Method to validate a snapshot with defaults or host overrides, discarding obsolete async results.
    public async validateInputs(): Promise<void> {
        // Capture one draft for this pass; later input changes invalidate its asynchronous results.
        const version = ++this.validation_version;

        const values = { ...this.state_refs.values.value };

        // In edit mode, omitted saved fields need not be entered again while currency and scope stay unchanged.
        // These are field names already held by the server, not their saved values.
        const stored =
            this.props.mode === "edit" &&
            values.currency_id === this.props.initial_values.currency_id &&
            values.bank_account_scope === this.props.initial_values.bank_account_scope
                ? this.props.stored_fields
                : [];

        // Validate only the fields exposed by the current currency, holder type and transfer scope.
        const fields = this.controller.computed_refs.validation_fields.value;

        this.setState("is_validating", true);

        const entries = await Promise.all(
            fields.map(async (field): Promise<[RecipientFieldKeyType, RecipientValidationResultInterface]> => {
                const value = values[field.key];

                // Only an omitted value can reuse stored data; an explicitly cleared value must be validated.
                const is_stored = value === undefined && stored.includes(field.key);

                const result = Util.validateField(value, field, is_stored);

                // Translate default message keys and insert the constraints used by this specific field.
                result.msg = result.msg
                    ? this.controller
                          .getContentTextValue(result.msg)
                          .replace("{{digits}}", String(field.digits ?? ""))
                          .replace("{{max_length}}", String(field.max_length ?? ""))
                    : "";

                const validator = this.props.action_props.validators?.[field.key];

                // Let the host replace the default format checks, without asking it to validate hidden saved values.
                if (validator && !is_stored) {
                    try {
                        // Give the override a read-only draft and a copy of the default result for optional reuse.
                        const custom = await validator(value, {
                            field,
                            values: Object.freeze({ ...values }),
                            default_result: { ...result }
                        });

                        // Overrides may replace format rules, but cannot make an empty required input valid.
                        const missing_required = field.required && !String(value ?? "").trim();

                        result.status = custom.status && !missing_required;

                        result.msg = result.status
                            ? ""
                            : custom.msg ||
                              result.msg ||
                              this.controller.getContentTextValue("validation_invalid_text");
                    } catch {
                        // A failed custom check must keep submission disabled and provide a visible error.
                        result.status = false;
                        result.msg = this.controller.getContentTextValue("validation_failed_text");
                    }
                }

                return [field.key, result];
            })
        );

        // A closed form or a newer validation pass owns the state now; ignore this outdated result.
        if (this.is_disposed || version !== this.validation_version) {
            return;
        }

        // Replace rather than merge so errors for a previous currency/scope disappear.
        this.state_refs.validation_results.value = Object.fromEntries(entries);

        this.setState("is_validating", false);
    }

    // Method to identify changes that require fresh bank-account resolution.
    public hasDestinationChange(): boolean {
        // New recipients need resolution; edits need it only when a destination field changes.
        // An undefined edit value means the saved value was not supplied, not that it was cleared.
        return (
            this.props.mode === "create" ||
            [
                "currency_id",
                this.controller.computed_refs.profile.value?.account_resolution?.bank_identifier ?? "bank_code",
                "account_number",
                "bank_account_scope"
            ].some((key) => {
                const field = key as RecipientFieldKeyType;
                return (
                    this.state_refs.values.value[field] !== undefined &&
                    this.state_refs.values.value[field] !== this.props.initial_values[field]
                );
            })
        );
    }

    // Method to initialize supported currencies without selecting an unsupported profile implicitly.
    public initialize = async (): Promise<void> => {
        const request_id = ++this.request_id;

        this.setState("is_loading", true);

        this.setState("error_text", "");

        try {
            const currencies = this.props.action_props.load_currencies
                ? await this.props.action_props.load_currencies()
                : this.props.currencies;

            // A newer initialization or a closed modal takes precedence over this response.
            if (this.is_disposed || request_id !== this.request_id) {
                return;
            }

            this.setState("currencies", currencies);

            // Preserve a supplied edit currency; a new form stays unselected until the user chooses one.
            const currency_id = this.state_refs.values.value.currency_id ?? "";

            await this.change("currency_id", currency_id, true);
        } catch (error: unknown) {
            if (!this.is_disposed) {
                this.setState(
                    "error_text",
                    error instanceof Error ? error.message : this.controller.getContentTextValue("load_failed_text")
                );
            }
        } finally {
            if (!this.is_disposed && request_id === this.request_id) {
                this.setState("is_loading", false);
            }
        }
    };

    // Method to reveal banking errors and format identifiers once the user leaves the input.
    public async blurIdentifier(event: FocusEvent): Promise<void> {
        const target = event.target as HTMLInputElement | null;
        const field = this.controller.computed_refs.fields.value.find(
            (item) => target?.id === `${this.props.id}_${item.key}`
        );

        if (!field || !FieldValidator.isBankIdentifier(field.key)) {
            return;
        }

        // Do not replace an omitted saved value with an empty string when editing.
        // A new blank field must still reveal its required error when the user leaves it.
        const value = this.state_refs.values.value[field.key];
        const is_stored = this.props.mode === "edit" && this.props.stored_fields.includes(field.key);

        if (value === undefined && is_stored) {
            return;
        }

        await this.change(field.key, FieldValidator.format(field.key, value ?? ""));
    }

    // Method to update one field and invalidate incompatible values and stale resolution evidence.
    public async change(
        key: RecipientFieldKeyType,
        value: string,
        initializing = false,
        mark_touched = true
    ): Promise<{ status: boolean; msg: string }> {
        // Initialization may restore read-only values; normal edits are blocked while saving.
        if (
            this.is_disposed ||
            (!initializing && (this.state_refs.is_submitting.value || this.props.readonly_fields.includes(key)))
        ) {
            return { status: false, msg: "" };
        }

        const values = this.state_refs.values.value;

        // Invalidate pending validators immediately and keep Review/Save disabled while dependencies change.
        this.validation_version += 1;
        this.setState("is_validating", true);

        // Mark user edits as touched so their validation messages can appear below the input.
        if (!initializing && mark_touched) {
            this.state_refs.touched_fields.value[key] = true;
        }

        // Even an unchanged value may need fresh validation when another field affects its rules.
        if (!initializing && values[key] === value) {
            await this.validateInputs();

            // Escape the message because InputUI renders this callback result as HTML.
            return {
                status: !this.getFieldError(key),
                msg: RenderHtmlUtil.escapeHtml(this.getFieldError(key))
            };
        }

        // Restart downstream interaction tracking so newly displayed fields do not immediately show errors.
        if (!initializing && key === "currency_id") {
            this.state_refs.touched_fields.value = { currency_id: true };
        } else if (!initializing && ["account_holder_type", "bank_account_scope"].includes(key)) {
            this.state_refs.touched_fields.value = {
                currency_id: this.state_refs.touched_fields.value.currency_id,
                account_holder_type: this.state_refs.touched_fields.value.account_holder_type,
                bank_account_scope: key === "bank_account_scope"
            };
        }

        // Each currency chooses its bank identifier, for example bank_code for NGN or sort_code for GBP.
        const identifier = this.controller.computed_refs.profile.value?.account_resolution?.bank_identifier;

        // Only changes affecting destination identity invalidate the previous lookup.
        // Initialization restores existing values without treating them as a user edit.
        const should_resolve =
            !initializing &&
            ["currency_id", "account_holder_type", "bank_account_scope", "account_number", identifier].includes(key);

        if (should_resolve) {
            this.invalidateResolution();
        }

        // Return to the editable form and clear any previous form-level submission error.
        this.setState("error_text", "");

        this.setState("is_review", false);

        // Keep saved destination details during edits; new forms restart downstream choices when holder type changes.
        if (key === "account_holder_type" && !initializing) {
            this.state_refs.values.value =
                this.props.mode === "edit"
                    ? { ...values, account_holder_type: value }
                    : {
                          currency_id: values.currency_id,
                          recipient_type: values.recipient_type,
                          account_holder_type: value
                      };
            this.setState("resolved_key", "");

            this.setState("banks", []);

            this.setState("lookup_error_text", "");
        } else if (key === "currency_id" && !initializing) {
            // Replace rather than merge so values from a previous currency never enter a new destination.
            this.state_refs.values.value = { currency_id: value };
        } else {
            this.state_refs.values.value = { ...values, [key]: value };
        }

        // Read the reactive profile after updating the draft so it matches the newly selected currency.
        const profile = this.controller.computed_refs.profile.value;

        if (key === "currency_id") {
            this.state_refs.values.value.recipient_type = profile?.recipient_type;

            if (profile?.recipient_type !== "bank_account") {
                delete this.state_refs.values.value.bank_account_scope;
            }

            const networks = this.controller.computed_refs.currency.value?.networks;

            // Preselect a network only when there is a single choice; otherwise leave it to the user.
            if (networks?.length === 1) {
                this.state_refs.values.value.network ??= networks[0];
            }

            await this.loadBanks();
        }

        // Edit mode retains the scope, so refresh its bank options after changing the holder type.
        if (key === "account_holder_type" && this.props.mode === "edit") {
            await this.loadBanks();
        }

        if (key === "bank_account_scope") {
            // Route-specific values must be entered again when changing local/international scope.
            // These are the field keys supported by the newly selected scope, not the entered values.
            const allowed = new Set(
                this.controller.computed_refs.fields.value.map((field) => {
                    return field.key;
                })
            );

            // Collect fields from all scopes so values belonging only to the old scope can be removed.
            const category_fields = Object.values(profile?.category_selector?.options ?? {}).flatMap((category) => {
                return category.fields;
            });

            // Keep shared fields and delete only fields that are no longer applicable.
            for (const field of category_fields) {
                if (!allowed.has(field.key)) {
                    delete this.state_refs.values.value[field.key];
                }
            }

            await this.loadBanks();
        }

        if (should_resolve) {
            // Do not display a name resolved for the previous destination while the new lookup is pending.
            if (
                this.controller.computed_refs.profile.value?.account_resolution?.enabled &&
                this.hasDestinationChange()
            ) {
                delete this.state_refs.values.value.account_name;
            }

            // The scheduler checks completeness and whether resolution is enabled before calling the host.
            this.scheduleResolution();
        }

        // Recheck all active inputs because this change can also alter other fields or their required rules.
        await this.validateInputs();

        // InputUI owns the normal inline error slot; controlled props also refresh dependent inputs.
        return {
            status: !this.getFieldError(key),
            msg: RenderHtmlUtil.escapeHtml(this.getFieldError(key))
        };
    }

    // Method to resolve or retry the current destination without overlapping host CSRF requests.
    public resolve = async (): Promise<void> => {
        clearTimeout(this.resolution_timer);

        if (!this.canResolve()) {
            return;
        }

        // Queue one lookup of the latest values instead of overlapping requests and their CSRF-token handling.
        if (this.resolution_running) {
            this.resolution_pending = true;
            return;
        }

        const config = this.controller.computed_refs.profile.value!.account_resolution!;

        const values = this.state_refs.values.value;

        const key = this.resolutionKey();

        // Snapshot this request generation before awaiting the provider.
        const version = this.resolution_version;

        this.resolution_running = true;

        this.setState("is_resolving", true);

        this.setState("resolution_error_text", "");

        this.setState("resolved_key", "");

        try {
            if (!this.props.action_props.resolve_account) {
                throw new Error("Resolver unavailable");
            }

            const result = await this.props.action_props.resolve_account({
                currency_code: values.currency_id ?? "",
                account_number: values.account_number!.trim(),
                // Use the configured API field, e.g. bank_code for NGN or sort_code for a supported GBP resolver.
                [config.bank_identifier]: values[config.bank_identifier]!.trim()
            });

            // Never put a name from an older destination into the currently edited form.
            if (this.is_disposed || version !== this.resolution_version || key !== this.resolutionKey()) {
                return;
            }

            if (!result.account_name?.trim()) {
                throw new Error("Unresolved account");
            }

            this.state_refs.values.value.account_name = result.account_name.trim();

            // Keep evidence that the displayed name was resolved for these exact current details.
            this.setState("resolved_key", key);
            await this.validateInputs();
        } catch (error: unknown) {
            // An obsolete failure must not replace the loading/error message for newer input.
            if (!this.is_disposed && version === this.resolution_version && key === this.resolutionKey()) {
                // The host translates API message keys; preserve that explanation beside the account-name input.
                this.setState(
                    "resolution_error_text",
                    error instanceof Error && error.message
                        ? error.message
                        : this.controller.getContentTextValue("resolve_failed_text")
                );
            }
        } finally {
            this.resolution_running = false;
            if (!this.is_disposed && version === this.resolution_version) {
                this.setState("is_resolving", false);
            }
            // Read the latest draft when starting the queued lookup; do not reuse this request's old values.
            if (!this.is_disposed && this.resolution_pending) {
                this.resolution_pending = false;
                void this.resolve();
            }
        }
    };

    // Method to validate, review and submit only applicable destination fields.
    public submit = async (): Promise<void> => {
        // Do not review or save while loading, resolving a name, submitting, or after the form closes.
        if (
            this.controller.computed_refs.is_busy.value ||
            this.state_refs.is_resolving.value ||
            this.state_refs.is_validating.value ||
            this.is_disposed
        ) {
            return;
        }

        for (const field of this.controller.computed_refs.validation_fields.value) {
            this.state_refs.touched_fields.value[field.key] = true;
        }

        await this.validateInputs();

        if (this.is_disposed || this.state_refs.is_validating.value) {
            return;
        }

        // Field definitions for the selected currency and scope: keys, required flags and validation rules.
        // This is the list of applicable inputs, not their entered values.
        const fields = this.controller.computed_refs.fields.value;

        // The current draft, indexed by field key, including the user's selections and entered details.
        const values = this.state_refs.values.value;

        // The selected currency's rendering rules, including whether a scope/category must be chosen.
        const profile = this.controller.computed_refs.profile.value;

        // Reuse the same default/host validation results that drive the inline errors and disabled button.
        // validateInputs permits omitted saved fields only for edits within the original currency and scope.
        if (
            !this.controller.computed_refs.details_ready.value ||
            !profile ||
            (profile.category_selector && !this.controller.computed_refs.category.value) ||
            !this.controller.computed_refs.validation_fields.value.every((field) => {
                return this.state_refs.validation_results.value[field.key]?.status === true;
            })
        ) {
            this.setState("error_text", this.controller.getContentTextValue("invalid_text"));
            return;
        }

        // For destinations requiring fresh resolution, the successful lookup must match the current draft.
        // Having any account name in the input is insufficient if the bank or account number has changed.
        if (
            this.controller.computed_refs.needs_resolution.value &&
            this.state_refs.resolved_key.value !== this.resolutionKey()
        ) {
            this.setState("error_text", this.controller.getContentTextValue("resolve_required_text"));
            return;
        }

        // Build the request from applicable fields plus currency, holder, type and scope selections.
        // For edits, omit undefined and unchanged values so the backend keeps existing details.
        // An explicit empty string becomes null, allowing optional fields to be cleared.
        const payload = Util.buildFormPayload(values, this.props.initial_values, fields, this.props.mode === "edit");

        // Avoid sending an empty update when no editable values have changed.
        if (!Object.keys(payload).length) {
            this.setState("error_text", this.controller.getContentTextValue("no_changes_text"));
            return;
        }

        this.setState("error_text", "");

        // The first click opens the review step without calling the API.
        // After review, the next click repeats validation above and proceeds with saving.
        if (!this.state_refs.is_review.value) {
            this.setState("is_review", true);
            return;
        }

        // Block duplicate saves until the host callback completes.
        this.setState("is_submitting", true);

        try {
            if (!this.props.action_props.submit) {
                throw new Error(this.controller.getContentTextValue("submit_unavailable_text"));
            }

            // The host application owns API transport, permissions, CSRF and what happens after a successful save.
            await this.props.action_props.submit(payload);
        } catch (error: unknown) {
            // Keep the form open with feedback when saving fails; ignore UI updates after it has closed.
            if (!this.is_disposed) {
                this.setState(
                    "error_text",
                    error instanceof Error ? error.message : this.controller.getContentTextValue("submit_failed_text")
                );
            }
        } finally {
            if (!this.is_disposed) {
                this.setState("is_submitting", false);
            }
        }
    };

    // Method to invalidate lookups when the modal is dismissed.
    public cleanup(): void {
        // Stop delayed work and invalidate both initialization and resolution responses after unmount.
        clearTimeout(this.resolution_timer);
        this.resolution_version += 1;
        this.resolution_pending = false;
        this.validation_version += 1;
        this.is_disposed = true;
        this.request_id += 1;
    }
}
export default WithdrawalRecipientFormUIActionHandler;

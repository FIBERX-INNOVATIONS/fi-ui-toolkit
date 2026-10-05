import type { PaymentCheckoutTransactionInterface } from "../types/payment_checkout_type";
import PaymentCheckoutUtil from "../utils/payment_checkout_util";

import type {
    DepositFlowUIPropsInterface,
    DepositFlowStateInterface,
    DepositFlowComputedInterface,
    DepositFlowComponentsInterface
} from "../ui_types/deposit_flow_ui_type";

import type {
    DepositDetailsInterface,
    DepositContextInterface,
    TransactionIntentInterface
} from "../types/deposit_flow_type";

import BaseActionHandler from "../base_classes/base_action_handler";

import { DepositFlowUISteps } from "../configs/deposit_flow_ui_config";

class DepositFlowUIActionHandler extends BaseActionHandler<
    DepositFlowUIPropsInterface,
    DepositFlowStateInterface,
    DepositFlowComputedInterface,
    DepositFlowComponentsInterface
> {
    private is_disposed = false;

    private last_intent: TransactionIntentInterface | null = null;

    private last_context = "";

    // Method to serialize requests and expose recoverable application-safe errors.
    private async run(action: () => Promise<void>): Promise<void> {
        if (this.is_disposed || this.state_refs.is_loading.value) {
            return;
        }

        this.setState("is_loading", true);
        this.setState("error_text", "");

        try {
            await action();
        } catch {
            if (!this.is_disposed && !this.state_refs.error_text.value) {
                this.setState("error_text", this.props.content_props.request_error_text);
            }
        } finally {
            if (!this.is_disposed) {
                this.setState("is_loading", false);
            }
        }
    }

    // Method to persist active identifiers or clear a completed transaction through the host encryption adapter.
    private persist(is_terminal = false): void {
        try {
            const { request_key, intent_public_id, transaction_reference, accounts } = this.state_refs.cache.value;

            // Allowlist persisted fields so legacy form snapshots cannot be saved again.
            const cache = is_terminal
                ? { version: 1 as const, request_key: crypto.randomUUID(), accounts }
                : { version: 1 as const, request_key, intent_public_id, transaction_reference, accounts };
            this.props.storage.save(cache);
        } catch {
            this.setState("error_text", this.props.content_props.storage_error_text);
            throw new Error("Deposit storage unavailable");
        }
    }

    // Method to construct the normalized context for provider and intent callbacks.
    private getContext(): DepositContextInterface {
        return {
            ...this.state_refs.details.value,
            provider_id: this.state_refs.provider_id.value,
            payment_method_id: this.state_refs.method_id.value
        };
    }

    // Method to restore identifiers and load a local or remote currency catalogue.
    public initialize = async (): Promise<void> => {
        await this.run(async () => {
            const cache = this.props.storage.load();

            if (cache) {
                if (cache.version !== 1 || !cache.request_key || !cache.accounts) {
                    throw new Error("Invalid deposit cache");
                }

                // Remove obsolete form snapshots when loading older saved drafts.
                this.state_refs.cache.value = {
                    version: 1,
                    request_key: cache.request_key,
                    intent_public_id: cache.intent_public_id,
                    transaction_reference: cache.transaction_reference,
                    accounts: cache.accounts
                };
            }

            this.persist();

            const currencies = this.props.action_props.fetch_currencies
                ? await this.props.action_props.fetch_currencies()
                : this.props.currencies;

            if (this.is_disposed) {
                return;
            }

            this.setState("currencies", currencies);

            // Reload editable values from the server, never from browser storage.
            if (cache?.intent_public_id && this.props.action_props.read_intent) {
                const intent = await this.props.action_props.read_intent(cache.intent_public_id);

                if (intent.public_id !== cache.intent_public_id) {
                    throw new Error("Intent identity mismatch");
                }

                if (this.is_disposed) {
                    return;
                }

                this.state_refs.cache.value.transaction_reference =
                    intent.transaction_reference ?? cache.transaction_reference;
                this.persist();

                if (intent.checkout) {
                    if (intent.checkout.public_id !== cache.intent_public_id) {
                        throw new Error("Checkout identity mismatch");
                    }
                    // Older saved drafts may have completed while the modal was closed.
                    if (PaymentCheckoutUtil.isTerminal(intent.checkout)) {
                        this.resetDraft();
                        this.setState("is_ready", true);
                        return;
                    }
                    this.applyCheckout(intent.checkout);
                    this.setState("is_ready", true);
                    return;
                }

                this.last_intent = intent;
                this.state_refs.details.value = {
                    currency_code: intent.currency_code,
                    amount: intent.amount,
                    description: intent.description
                };

                this.last_context = JSON.stringify({
                    ...this.state_refs.details.value,
                    provider_id: intent.provider_id ?? "",
                    payment_method_id: intent.payment_method_id ?? ""
                });

                this.setState("intent", intent);
                this.setState("step", "review");
            }

            this.setState("is_ready", true);
        });
    };

    // Method to fetch eligible providers after validating details in the child component.
    public submitDetails = async (details: DepositDetailsInterface): Promise<void> => {
        if (this.state_refs.step.value === "checkout") {
            return;
        }
        await this.run(async () => {
            this.state_refs.details.value = details;
            const providers = await this.props.action_props.fetch_providers(details);

            if (this.is_disposed) {
                return;
            }

            // New details invalidate provider and method selections, but retain the draft ID.
            this.setState("providers", providers);
            this.setState("provider_id", "");
            this.setState("method_id", "");
            this.setState("methods", []);
            this.setState("intent", null);
            this.setState("step", "provider");
        });
    };

    // Method to provision when needed and resolve embedded or fetched payment methods.
    public selectProvider = async (provider_id: string): Promise<void> => {
        if (this.state_refs.step.value === "checkout") {
            return;
        }
        await this.run(async () => {
            const provider = this.state_refs.providers.value.find((item) => {
                return item.id === provider_id;
            });

            if (!provider) {
                return;
            }

            this.setState("provider_id", provider_id);
            this.setState("method_id", "");

            const fetch_method = this.props.action_props?.fetch_methods;

            const transaction_details_input = this.state_refs.details.value;

            const methods = provider.methods ?? (await fetch_method?.(transaction_details_input, provider)) ?? [];

            if (this.is_disposed) {
                return;
            }

            this.setState("methods", methods);
            this.setState("step", "method");
        });
    };

    // Method to create or update the same intent and persist its public identifier before review.
    public selectMethod = async (method_id: string): Promise<void> => {
        const { step, methods } = this.state_refs;

        if (step.value !== "method") {
            return;
        }

        await this.run(async () => {
            const is_valid_method = methods.value.some((item) => {
                return item.id === method_id;
            });

            if (!is_valid_method) {
                return;
            }

            this.setState("method_id", method_id);

            const cache = this.state_refs.cache.value;
            const existing_id = cache.intent_public_id;

            if (existing_id && !this.props.action_props.update_intent) {
                this.setState("error_text", this.props.content_props.update_unavailable_text);
                return;
            }

            const context = this.getContext();

            if (this.is_disposed) {
                return;
            }

            // Reuse an unchanged server summary without issuing another mutation.
            if (existing_id && this.last_intent && this.last_context === JSON.stringify(context)) {
                this.persist();
                this.setState("intent", this.last_intent);
                this.setState("step", "review");
                return;
            }

            // Save the retry key before sending the request; form values stay in memory.
            this.persist();

            const intent = existing_id
                ? await this.props.action_props.update_intent!(existing_id, context)
                : await this.props.action_props.create_intent(context, cache.request_key);

            if (!intent.public_id || (existing_id && intent.public_id !== existing_id)) {
                throw new Error("Intent identity mismatch");
            }

            // Keep the returned identity even if saving fails or the modal has closed.
            this.last_intent = intent;
            this.last_context = JSON.stringify(context);
            cache.intent_public_id = intent.public_id;
            cache.transaction_reference = intent.transaction_reference ?? cache.transaction_reference;
            this.persist();

            if (this.is_disposed) {
                return;
            }

            this.setState("intent", intent);
            this.setState("step", "review");

            this.props.action_props.on_review?.(intent);
        });
    };

    // Method to retain the same transaction identity and display backend checkout state.
    private applyCheckout(transaction: PaymentCheckoutTransactionInterface): void {
        const cache = this.state_refs.cache.value;

        if (transaction.public_id !== cache.intent_public_id) {
            throw new Error("Checkout identity mismatch");
        }

        cache.transaction_reference = transaction.transaction_reference ?? cache.transaction_reference;

        // Lock editing before persistence so a storage error cannot expose a second initiation.
        if (!this.is_disposed) {
            this.setState("checkout", transaction);
            this.setState("step", "checkout");
        }

        // Keep completion visible in this modal, but never restore it as the next deposit.
        this.persist(PaymentCheckoutUtil.isTerminal(transaction));

        if (!this.is_disposed) {
            this.props.action_props.on_transaction_change?.(transaction);
        }
    }

    // Method to initiate only the intent the user has explicitly reviewed and confirmed.
    public confirm = async (): Promise<void> => {
        const intent = this.state_refs.intent.value;

        if (this.state_refs.step.value !== "review" || !intent || !this.props.action_props.initiate_transaction) {
            return;
        }
        await this.run(async () => {
            if (intent.public_id !== this.state_refs.cache.value.intent_public_id) {
                throw new Error("Intent identity mismatch");
            }

            this.persist();

            // An uncertain response must be reconciled, not retried as a new payment.
            this.setState("checkout", {
                public_id: intent.public_id,
                transaction_reference: intent.transaction_reference,
                status: "unknown",
                outcome: "pending",
                next_action: { type: "pending", reason: "awaiting_provider" }
            });

            this.setState("step", "checkout");

            const transaction = await this.props.action_props.initiate_transaction!(intent.public_id);

            this.applyCheckout(transaction);
        });
    };

    // Method to refresh or verify the saved transaction without initiating another charge.
    public refreshCheckout = async (): Promise<void> => {
        const public_id = this.state_refs.cache.value.intent_public_id;

        if (!public_id || !this.props.action_props.refresh_transaction || this.state_refs.step.value !== "checkout") {
            return;
        }
        await this.run(async () => {
            const intent = await this.props.action_props.refresh_transaction!(public_id);

            if (intent.public_id !== public_id) {
                throw new Error("Checkout identity mismatch");
            }
            if (this.is_disposed) {
                return;
            }
            if (intent.checkout) {
                this.applyCheckout(intent.checkout);
                return;
            }

            // Only an authoritative editable intent can restore the confirmation screen.
            this.last_intent = intent;
            this.last_context = "";
            this.setState("intent", intent);
            this.setState("details", {
                currency_code: intent.currency_code,
                amount: intent.amount,
                description: intent.description
            });
            this.setState("checkout", null);
            this.setState("step", "review");
        });
    };

    // Method to create a fresh draft only after a terminal backend outcome and explicit request.
    public startNewDeposit = (): void => {
        const transaction = this.state_refs.checkout.value;
        if (
            this.is_disposed ||
            this.state_refs.is_loading.value ||
            !transaction ||
            !PaymentCheckoutUtil.isTerminal(transaction)
        ) {
            return;
        }
        try {
            this.resetDraft();
        } catch {
            // Storage failure keeps the current completed transaction visible for retry.
        }
    };

    // Method to discard completed draft details after saving fresh identifiers successfully.
    private resetDraft(): void {
        const cache = {
            version: 1 as const,
            request_key: crypto.randomUUID(),
            accounts: this.state_refs.cache.value.accounts
        };
        try {
            this.props.storage.save(cache);
        } catch {
            this.setState("error_text", this.props.content_props.storage_error_text);
            throw new Error("Deposit storage unavailable");
        }
        this.last_intent = null;
        this.last_context = "";
        this.state_refs.cache.value = cache;
        this.setState("intent", null);
        this.setState("checkout", null);
        this.setState("providers", []);
        this.setState("methods", []);
        this.setState("provider_id", "");
        this.setState("method_id", "");
        this.setState("details", { ...this.props.initial_values });
        this.setState("error_text", "");
        this.setState("step", "details");
    }

    // Method to route the selected option to its current deposit step.
    public submitSelected = async (provider_or_method_id: string): Promise<void> => {
        const state = this.state_refs;
        const step = state.step.value;

        if (step === DepositFlowUISteps.PROVIDER_STEP) {
            return this.selectProvider(provider_or_method_id);
        } else if (step === DepositFlowUISteps.METHOD_STEP) {
            return this.selectMethod(provider_or_method_id);
        }
    };

    // Method to return to editable details without discarding the persisted transaction identity.
    public back = (): void => {
        const state = this.state_refs;
        const step = state.step.value;

        if (
            state.is_loading.value ||
            step === DepositFlowUISteps.DETAILS_STEP ||
            step === DepositFlowUISteps.CHECKOUT_STEP
        ) {
            return;
        }

        this.setState("error_text", "");
        this.setState("step", this.state_refs.step.value === "method" ? "provider" : "details");
    };

    // Method to prevent an unmounted flow from navigating after asynchronous work.
    public cleanup(): void {
        this.is_disposed = true;
    }
}
export default DepositFlowUIActionHandler;

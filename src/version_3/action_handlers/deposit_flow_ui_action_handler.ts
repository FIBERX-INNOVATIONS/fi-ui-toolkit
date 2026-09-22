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

import DepositIntentRejectedError from "../utils/deposit_intent_rejected_error";

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

    // Method to persist identifiers before and after mutations through the host encryption adapter.
    private persist(): void {
        try {
            this.props.storage.save(this.state_refs.cache.value);
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

    // Method to ensure a required provider account at its configured stage.
    private async ensureAccount(stage: "provider" | "method"): Promise<string | undefined> {
        const provider = this.state_refs.providers.value.find((item) => {
            return item.id === this.state_refs.provider_id.value;
        });

        const provisioning = provider?.provisioning;

        if (!provisioning) {
            return undefined;
        }

        const cache_key = `${provider?.id}:${provisioning.cache_key}:${provisioning.stage === "method" ? this.state_refs.method_id.value : ""}`;

        const cached_id = this.state_refs.cache.value.accounts[cache_key];

        if (provisioning.stage !== stage) {
            return cached_id;
        }

        if (!this.props.action_props.ensure_account) {
            this.setState("error_text", this.props.content_props.provisioning_unavailable_text);
            throw new Error("Missing provisioning callback");
        }

        const account_id = await this.props.action_props.ensure_account(this.getContext(), cached_id);

        if (!account_id) {
            throw new Error("Missing provider account ID");
        }

        this.state_refs.cache.value.accounts[cache_key] = account_id;

        this.persist();

        return account_id;
    }

    // Method to restore identifiers and load a local or remote currency catalogue.
    public initialize = async (): Promise<void> => {
        await this.run(async () => {
            const cache = this.props.storage.load();

            if (cache) {
                if (cache.version !== 1 || !cache.request_key || !cache.accounts) {
                    throw new Error("Invalid deposit cache");
                }
                this.state_refs.cache.value = cache;
            }

            this.persist();

            const currencies = this.props.action_props.fetch_currencies
                ? await this.props.action_props.fetch_currencies()
                : this.props.currencies;

            if (this.is_disposed) {
                return;
            }

            this.setState("currencies", currencies);

            if (cache?.submitted_context) {
                this.state_refs.details.value = {
                    currency_code: cache.submitted_context.currency_code,
                    amount: cache.submitted_context.amount,
                    description: cache.submitted_context.description
                };
            }

            if (cache?.intent_public_id && this.props.action_props.read_intent) {
                const intent = await this.props.action_props.read_intent(cache.intent_public_id);
                if (intent.public_id !== cache.intent_public_id) {
                    throw new Error("Intent identity mismatch");
                }
                if (this.is_disposed) {
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
                    payment_method_id: intent.payment_method_id ?? "",
                    provider_account_id: cache.submitted_context?.provider_account_id
                });
                this.setState("intent", intent);
                this.setState("step", "review");
            }

            this.setState("is_ready", true);
        });
    };

    // Method to fetch eligible providers after validating details in the child component.
    public submitDetails = async (details: DepositDetailsInterface): Promise<void> => {
        await this.run(async () => {
            this.state_refs.details.value = details;
            const providers = await this.props.action_props.fetch_providers(details);
            if (this.is_disposed) {
                return;
            }
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
        await this.run(async () => {
            const provider = this.state_refs.providers.value.find((item) => {
                return item.id === provider_id;
            });

            if (!provider) {
                return;
            }

            this.setState("provider_id", provider_id);
            this.setState("method_id", "");

            await this.ensureAccount("provider");

            const methods =
                provider.methods ??
                (await this.props.action_props.fetch_methods?.(this.state_refs.details.value, provider)) ??
                [];

            if (this.is_disposed) {
                return;
            }

            this.setState("methods", methods);
            this.setState("step", "method");
        });
    };
    // Method to create or update the same intent and persist its public identifier before review.
    public selectMethod = async (method_id: string): Promise<void> => {
        if (this.state_refs.step.value !== "method") {
            return;
        }

        await this.run(async () => {
            if (
                !this.state_refs.methods.value.some((item) => {
                    return item.id === method_id;
                })
            ) {
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

            context.provider_account_id = await this.ensureAccount("method");

            if (this.is_disposed) {
                return;
            }

            // Preserve the first submitted payload on ambiguous failures so retries cannot create a different transaction.
            if (
                !existing_id &&
                cache.submitted_context &&
                JSON.stringify(cache.submitted_context) !== JSON.stringify(context)
            ) {
                this.setState("error_text", this.props.content_props.update_unavailable_text);
                return;
            }

            if (existing_id && this.last_intent && this.last_context === JSON.stringify(context)) {
                this.persist();
                this.setState("intent", this.last_intent);
                this.setState("step", "review");
                return;
            }

            cache.submitted_context = context;
            this.persist();

            let intent: TransactionIntentInterface;

            try {
                intent = existing_id
                    ? await this.props.action_props.update_intent!(existing_id, context)
                    : await this.props.action_props.create_intent(context, cache.request_key);
            } catch (error: unknown) {
                if (!existing_id && error instanceof DepositIntentRejectedError) {
                    delete cache.submitted_context;
                    this.persist();
                }
                throw error;
            }

            if (!intent.public_id || (existing_id && intent.public_id !== existing_id)) {
                throw new Error("Intent identity mismatch");
            }

            this.last_intent = intent;
            this.last_context = JSON.stringify(context);
            cache.intent_public_id = intent.public_id;
            this.persist();

            if (this.is_disposed) {
                return;
            }

            this.setState("intent", intent);
            this.setState("step", "review");

            this.props.action_props.on_review?.(intent);
        });
    };

    // Method to return to editable details without discarding the persisted transaction identity.
    public back = (): void => {
        if (this.state_refs.is_loading.value) {
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

export interface DepositCurrencyInterface {
    code: string;
    name: string;
    precision: number;
}
export interface DepositDetailsInterface {
    currency_code: string;
    amount: string;
    description: string;
}
export interface PaymentOptionInterface {
    id: string;
    name: string;
    description?: string;
    fee_label_text?: string;
    methods?: PaymentOptionInterface[];
    provisioning?: { stage: "provider" | "method"; cache_key: string };
}
export interface DepositContextInterface extends DepositDetailsInterface {
    provider_id: string;
    payment_method_id: string;
    provider_account_id?: string;
}
export interface TransactionIntentInterface {
    provider_id?: string;
    payment_method_id?: string;
    public_id: string;
    currency_code: string;
    amount: string;
    description: string;
    fee_amount: string;
    net_amount: string;
    fee_lines?: { label_text: string; amount: string }[];
}
export interface DepositCacheInterface {
    version: 1;
    request_key: string;
    intent_public_id?: string;
    accounts: Record<string, string>;
    submitted_context?: DepositContextInterface;
}
export interface DepositStorageInterface {
    load: () => DepositCacheInterface | null;
    save: (cache: DepositCacheInterface) => void;
}
export interface DepositActionsInterface {
    fetch_currencies?: () => Promise<DepositCurrencyInterface[]>;
    fetch_providers: (details: DepositDetailsInterface) => Promise<PaymentOptionInterface[]>;
    fetch_methods?: (
        details: DepositDetailsInterface,
        provider: PaymentOptionInterface
    ) => Promise<PaymentOptionInterface[]>;
    ensure_account?: (context: DepositContextInterface, cached_id?: string) => Promise<string>;
    create_intent: (context: DepositContextInterface, request_key: string) => Promise<TransactionIntentInterface>;
    update_intent?: (public_id: string, context: DepositContextInterface) => Promise<TransactionIntentInterface>;
    read_intent?: (public_id: string) => Promise<TransactionIntentInterface>;
    on_review?: (intent: TransactionIntentInterface) => void;
}

import type {
    PaymentCheckoutConfigInterface,
    PaymentCheckoutTransactionInterface,
    PaymentNextActionType
} from "../types/payment_checkout_type";

class PaymentCheckoutUtil {
    // Method to suppress stale instructions after terminal outcomes or bank instruction expiry.
    public static getAction(
        transaction: PaymentCheckoutTransactionInterface | null,
        now: number
    ): PaymentNextActionType {
        if (!transaction || this.isTerminal(transaction)) {
            return { type: "none" };
        }
        if (transaction.outcome === "review") {
            return { type: "pending", reason: "payment_review_required" };
        }

        const action = transaction.next_action;
        if (action.type === "bank_transfer" && action.expires_at) {
            const expiry = Date.parse(action.expires_at);
            if (!Number.isFinite(expiry) || expiry <= now) {
                return { type: "pending", reason: "instructions_expired" };
            }
        }
        return action;
    }

    // Method to allow hosted payment checks only after checkout was opened for this transaction.
    public static canRefresh(
        transaction: PaymentCheckoutTransactionInterface | null,
        started_transaction_id: string
    ): boolean {
        if (!transaction || this.isTerminal(transaction)) {
            return false;
        }
        return transaction.next_action.type !== "redirect" || transaction.public_id === started_transaction_id;
    }

    // Method to identify backend-confirmed outcomes that permit a separate new deposit.
    public static isTerminal(transaction: PaymentCheckoutTransactionInterface): boolean {
        return ["success", "failed", "cancelled", "expired"].includes(transaction.outcome);
    }

    // Method to accept only HTTPS checkout links within the host's optional origin policy.
    public static getCheckoutLink(action: PaymentNextActionType, config: PaymentCheckoutConfigInterface): string {
        if (action.type !== "redirect") {
            return "";
        }
        try {
            const url = new URL(action.url);
            if (url.protocol !== "https:" || url.username || url.password) {
                return "";
            }
            if (config.allowed_origins.length && !config.allowed_origins.includes(url.origin)) {
                return "";
            }
            return url.href;
        } catch {
            return "";
        }
    }
}

export default PaymentCheckoutUtil;

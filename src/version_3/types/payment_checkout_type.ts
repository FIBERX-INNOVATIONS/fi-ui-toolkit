// Customer-facing actions; provider credentials and audit payloads never enter this contract.
export type PaymentNextActionType =
    | { type: "none" }
    | { type: "pending"; reason: "awaiting_provider" | "instructions_expired" | "payment_review_required" }
    | { type: "provider_action"; action: string; backend_support_required: true }
    | { type: "redirect"; url: string; access_code: string | null }
    | {
          type: "bank_transfer";
          amount: string;
          currency_code: string;
          account_number: string;
          account_name: string | null;
          bank_name: string | null;
          bank_code: string | null;
          expires_at: string | null;
      }
    | {
          type: "wallet_transfer";
          amount: string;
          currency_code: string;
          wallet_address: string;
          network: string | null;
          memo: string | null;
      };

export interface PaymentCheckoutTransactionInterface {
    public_id: string;
    transaction_reference?: string;
    provider_code?: string;
    status: string;
    // The host maps its authoritative backend lifecycle to these presentation states.
    outcome: "pending" | "review" | "success" | "failed" | "cancelled" | "expired";
    next_action: PaymentNextActionType;
}

export interface PaymentCheckoutConfigInterface {
    mode: "new_tab" | "iframe" | "redirect" | "sdk";
    // HTTPS URLs only. Empty permits any HTTPS origin for links, but never for frames.
    allowed_origins: string[];
    iframe_origins: string[];
    // Resume the initialized payment; never create another charge in this callback.
    launch_sdk?: (
        action: Extract<PaymentNextActionType, { type: "redirect" }>,
        transaction: PaymentCheckoutTransactionInterface
    ) => Promise<void>;
}

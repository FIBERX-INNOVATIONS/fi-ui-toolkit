# Reusable deposit components

`DepositDetailsUI`, `PaymentOptionPickerUI`, and `TransactionIntentReviewUI` are independently usable. `DepositFlowUI` coordinates them without depending on an application, modal, endpoint URL, authentication scheme, or encryption key. All views are thin. The standalone steps share `PaymentStepUIController`, `PaymentStepUIActionHandler`, `PaymentStepUIProps`, `PaymentStepUIPropsBuilder`, typed UI contracts, and class styles; shared behavior is deliberately not copied into three controllers. Domain contracts live in `types/deposit_flow_type.ts`. The coordinator has its own corresponding stack.

## Host integration

Use `DepositFlowUIPropsBuilder.getReactivePropsObject(id, { action_props, storage }, overrides)` and pass the result to `DepositFlowUI`. Supply complete localized `content_props`; toolkit defaults are blank. Override `class_styles` with the typed `PaymentStepClassStylesInterface`, including nested `button`, `back_button`, and `input` styles. Classes belong in your application's class-style module. Payment initiation is opt-in through `initiate_transaction`; without that callback the flow still ends at review.

- `currencies`: local `{code, name, precision}[]`, or `action_props.fetch_currencies` returning that array.
- `initial_values`: `{currency_code, amount, description}`; **amount is a decimal string**. Optional `readonly_fields` locks generated values. Prefills seed a mounted component; remount with a new key to intentionally replace an in-progress draft.
- `description_required`: defaults to false. Fibase sets true.
- Amounts are validated without floating-point conversion. Positive values only; exponent notation, malformed grouping and excessive precision are rejected. Valid amounts gain comma separators on blur, preserving cursor behavior during entry. Changing currency validates against the newly selected precision without silently rounding.
- `fetch_providers(details)`: returns normalized `PaymentOptionInterface[]`. A callback can return a local array, so no network request is required. Optional `fee_label_text` must describe the host's known estimate or fee schedule; the toolkit never invents fees.
- `provider.methods`: embedded methods. When omitted, `fetch_methods(details, provider)` supplies them. An explicitly empty array means no methods are available.
- `provider.provisioning`: `{stage: "provider" | "method", cache_key}`. Use a stable provider-configuration/currency scope in `cache_key`. The coordinator invokes `ensure_account(context, cached_id)` at that stage and persists the returned account ID. The host must verify the cached ID belongs to the current identity; local cache is never proof of authorization. A missing required callback blocks advancement. Provisioning endpoints must be idempotent.
- `create_intent(context, request_key)`: return an authoritative `TransactionIntentInterface` with public ID, optional `transaction_reference`, currency, amount, description, total fee, net amount, and optional fee lines. Use `request_key` as the backend idempotency key and stable application reference.
- `update_intent(public_id, context)`: update the **same draft**. The returned public ID must match. The host handles concurrency/version tokens. Missing update support blocks edits rather than creating a replacement transaction.
- `read_intent(public_id)`: restore the current server summary when the flow reopens. Validate draft status and ownership on the backend and reject completed/noneditable records.
- `on_review(intent)`: optional notification after review is reached. It is not payment confirmation. Confirmation is separate and requires the `initiate_transaction` adapter.

## Persistence and retries

Supply `storage.load()` and `storage.save(cache)` scoped to application/environment/current identity and a draft slot. Back them with the host's existing initialized `LocalStorageManagerUtil` and encrypted schema; do not initialize a second global storage manager. Fibase uses the `wallet_deposit_drafts` schema field. Its encrypted cache contains only the intent public ID, returned transaction reference, stable idempotency key, provider account IDs, and schema version. Currency, amount, description, and submitted context are never persisted. Loading an older draft removes its form snapshot when the sanitized cache is saved. Fibase retains drafts across logout but scopes them by API base URL and member, so another signed-in member uses a different cache entry.

A retry key is persisted before any mutation so uncertain create retries reuse the same idempotency key. The host/backend must enforce idempotency and reject conflicting payloads for that key; the toolkit does not freeze editable fields or generate a new key after an uncertain response. Once created, edits always update the saved public ID. Successful responses retain their ID and transaction reference in memory even if saving fails, allowing persistence to retry without another mutation. Back navigation retains the identity. Reopening loads editable values through `read_intent`, not a local form snapshot. Close/unmount suppresses navigation while returned mutation identifiers are still saved when possible.

The host owns draft completion/abandonment and multi-tab policy. Clear the completed draft only after a future payment/abandonment lifecycle explicitly confirms it; do not clear merely when a modal closes. A backend-confirmed terminal outcome clears the persisted transaction ID/reference and rotates the retry key immediately. The current modal retains the completion result in memory; reopening starts a fresh deposit.

## Standalone steps

`PaymentStepUIPropsBuilder.getReactivePropsObject` supplies common props. Details calls `action_props.on_details` with validated decimal strings. The picker calls `on_select` only for an available option; use separate component keys for provider and method steps. Review renders the returned intent and exposes `on_back`. Supply loading state for external work; standalone submission callbacks also have an internal duplicate-submission guard and rejection handling.

## Validation

From an application that provides `tsx`, run:

```sh
node --import tsx --test /path/to/fi-ui-toolkit/tests/deposit_flow.test.ts
```

These mock-only tests cover exact decimal values, draft updates, idempotent retries, provisioning timing/cache, storage failures, restoration, and unmount behavior. No live financial operations are performed.

Localized `content_props` keys use `_text`, including `currency_label_text`, `amount_label_text`, `description_label_text`, `next_btn_text`, `back_btn_text`, `request_error_text`, and per-step title/subtitle keys. Display-only provider fee labels and review row labels use `fee_label_text` and `label_text`. API currency names and draft fields such as `amount` and `description` are unchanged. URL/image content uses `_link`/`_img` when supplied; SVG keys remain `_icon`.


## Confirmation and checkout

The review step shows `confirm_btn_text` only when `action_props.initiate_transaction(public_id)` is provided. It confirms the saved public ID once and transitions to `PaymentCheckoutUI`. The callback returns `PaymentCheckoutTransactionInterface`: public ID, reference, provider code when available, backend status, a normalized outcome, and `next_action`. The public ID must match the saved draft. Do not infer success from a redirect, popup callback, iframe load, or `next_action: none`.

The normalized outcome is `pending`, `review`, `success`, `failed`, `cancelled`, or `expired`. The host maps its backend statuses. `review` suppresses payment instructions for uncertain partial/overpayments. Terminal outcomes suppress even stale redirect/transfer actions. Amounts in instructions are exact major-unit strings, including backend-resolved collection fees; they are displayed without number conversion.

`PaymentCheckoutUI` has a standalone Vue/controller/action-handler/props/builder/UI-types/domain-types/styles stack. It accepts a transaction, localized content, class styles, configuration and `on_refresh`/`on_new_deposit` callbacks. Configure it in a deposit flow through `checkout_props`; the coordinator supplies transaction and loading state plus its own lifecycle callbacks.

### Presentation modes

- `new_tab` (default): a normal HTTPS link opened with `noopener noreferrer`. It is clicked after initiation, avoiding pop-up blockers tied to asynchronous requests.
- `redirect`: the Open checkout button navigates the current tab to the already initialized checkout URL. The saved transaction ID restores checkout on return.
- `iframe`: the Open checkout button embeds the hosted URL in the current view/modal. Add its exact HTTPS origin to `config.iframe_origins`; this is opt-in because many providers forbid framing. A new-tab link remains visible when a frame is blocked. The iframe uses a sandbox and does not grant top-level navigation.
- `sdk`: supply `config.launch_sdk(action, transaction): Promise<void>` from the host application. Load its chosen provider SDK there, dispatch by `transaction.provider_code`, and resume the existing payment using `action.access_code` when applicable. Resolve when the SDK closes/finishes; the component then requests backend refresh. Reject on SDK errors. Never initialize a second charge or treat the callback as success. Hosted checkout remains available as a fallback. No provider SDK or frontend key is required for the default hosted mode.

`config.allowed_origins` optionally restricts hosted URLs to exact HTTPS origins. Empty permits backend-returned HTTPS URLs; credential-bearing, relative, non-HTTPS and malformed URLs are rejected. Checkout URLs/access codes/instructions stay in memory and are never saved with the draft identifiers.

### Actions and recovery

`redirect` offers checkout; `bank_transfer` displays the expected collection amount and available account/bank details; `wallet_transfer` displays amount, address, network and memo/tag. Missing optional fields are omitted. Bank expiry is checked while the component is mounted, with expired/invalid instructions hidden. `pending` shows waiting, expired-instruction or payment-review copy. `provider_action` shows an unsupported-route state. `none` shows no available action, independently of payment success.

An uncertain initiation error stays in checkout with editing locked. `refresh_transaction(public_id)` must read/verify the same backend transaction and return the usual summary with `checkout` present for noneditable transactions. Only a server-confirmed editable intent returns to review. No automatic initiation retries or polling occur. `on_transaction_change` lets the host refresh wallet balances/history.

Reload uses `read_intent` with the same summary/optional-checkout contract and resumes checkout when already initiated. Closing a view preserves active transactions. Terminal outcomes automatically clear persisted transaction identifiers while preserving account IDs. Older cached terminal records are detected on load and reset to initial form values rather than reopening checkout. The Make another deposit button can reset the current completion view without closing it. Persistence failure prevents a fresh draft from replacing unsaved state.

Run both mock suites with `node --import tsx --test /path/to/fi-ui-toolkit/tests/deposit_flow.test.ts /path/to/fi-ui-toolkit/tests/payment_checkout.test.ts`.

Once the backend confirms a terminal outcome, checkout hides Check payment status and leaves Make another deposit as the remaining action. Pending and review-required transactions retain status checking.

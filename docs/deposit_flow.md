# Reusable deposit components

`DepositDetailsUI`, `PaymentOptionPickerUI`, and `TransactionIntentReviewUI` are independently usable. `DepositFlowUI` coordinates them without depending on an application, modal, endpoint URL, authentication scheme, or encryption key. All views are thin. The standalone steps share `PaymentStepUIController`, `PaymentStepUIActionHandler`, `PaymentStepUIProps`, `PaymentStepUIPropsBuilder`, typed UI contracts, and class styles; shared behavior is deliberately not copied into three controllers. Domain contracts live in `types/deposit_flow_type.ts`. The coordinator has its own corresponding stack.

## Host integration

Use `DepositFlowUIPropsBuilder.getReactivePropsObject(id, { action_props, storage }, overrides)` and pass the result to `DepositFlowUI`. Supply complete localized `content_props`; toolkit defaults are blank. Override `class_styles` with the typed `PaymentStepClassStylesInterface`, including nested `button`, `back_button`, and `input` styles. Classes belong in your application's class-style module. No payment is initiated by this flow.

- `currencies`: local `{code, name, precision}[]`, or `action_props.fetch_currencies` returning that array.
- `initial_values`: `{currency_code, amount, description}`; **amount is a decimal string**. Optional `readonly_fields` locks generated values. Prefills seed a mounted component; remount with a new key to intentionally replace an in-progress draft.
- `description_required`: defaults to false. Fibase sets true.
- Amounts are validated without floating-point conversion. Positive values only; exponent notation, malformed grouping and excessive precision are rejected. Valid amounts gain comma separators on blur, preserving cursor behavior during entry. Changing currency validates against the newly selected precision without silently rounding.
- `fetch_providers(details)`: returns normalized `PaymentOptionInterface[]`. A callback can return a local array, so no network request is required. Optional `fee_label_text` must describe the host's known estimate or fee schedule; the toolkit never invents fees.
- `provider.methods`: embedded methods. When omitted, `fetch_methods(details, provider)` supplies them. An explicitly empty array means no methods are available.
- `provider.provisioning`: `{stage: "provider" | "method", cache_key}`. Use a stable provider-configuration/currency scope in `cache_key`. The coordinator invokes `ensure_account(context, cached_id)` at that stage and persists the returned account ID. The host must verify the cached ID belongs to the current identity; local cache is never proof of authorization. A missing required callback blocks advancement. Provisioning endpoints must be idempotent.
- `create_intent(context, request_key)`: return an authoritative `TransactionIntentInterface` with public ID, currency, amount, description, total fee, net amount, and optional fee lines. Use `request_key` as the backend idempotency key and stable application reference.
- `update_intent(public_id, context)`: update the **same draft**. The returned public ID must match. The host handles concurrency/version tokens. Missing update support blocks edits rather than creating a replacement transaction.
- `read_intent(public_id)`: restore the current server summary when the flow reopens. Validate draft status and ownership on the backend and reject completed/noneditable records.
- `on_review(intent)`: optional notification after review is reached. It is not payment confirmation. Initiation is deliberately outside this component.

## Persistence and retries

Supply `storage.load()` and `storage.save(cache)` scoped to application/environment/current identity and a draft slot. Back them with the host's existing initialized `LocalStorageManagerUtil` and encrypted schema; do not initialize a second global storage manager. Fibase uses the `wallet_deposit_drafts` schema field. Its encrypted cache contains only identifiers, an idempotency reference, and the submitted draft details needed to retry safely—never provider credentials or payment-card details. Fibase retains drafts across logout but scopes them by API base URL and member, so another signed-in member uses a different cache entry.

A reference is persisted before any mutation. Hosts may throw `DepositIntentRejectedError` only for a definitive rejection where no intent was created; the user can then correct their details. Network failures, server errors and ambiguous conflicts must remain ordinary errors. The first submitted context is frozen on uncertain create failures: retry with the same reference and payload; do not reuse it with different values. Successful create responses retain their ID in memory even if saving fails; retrying persistence does not create a second intent. Back navigation retains that identity. Reopening restores it through `read_intent`. Close/unmount suppresses asynchronous navigation, while returned mutation identifiers are still saved when possible.

The host owns draft completion/abandonment and multi-tab policy. Clear the completed draft only after a future payment/abandonment lifecycle explicitly confirms it; do not clear merely when a modal closes. This first phase ends at review.

## Standalone steps

`PaymentStepUIPropsBuilder.getReactivePropsObject` supplies common props. Details calls `action_props.on_details` with validated decimal strings. The picker calls `on_select` only for an available option; use separate component keys for provider and method steps. Review renders the returned intent and exposes `on_back`. Supply loading state for external work; standalone submission callbacks also have an internal duplicate-submission guard and rejection handling.

## Validation

From an application that provides `tsx`, run:

```sh
node --import tsx --test /path/to/fi-ui-toolkit/tests/deposit_flow.test.ts
```

These mock-only tests cover exact decimal values, draft updates, idempotent retries, provisioning timing/cache, storage failures, restoration, and unmount behavior. No live financial operations are performed.

Localized `content_props` keys use `_text`, including `currency_label_text`, `amount_label_text`, `description_label_text`, `next_btn_text`, `back_btn_text`, `request_error_text`, and per-step title/subtitle keys. Display-only provider fee labels and review row labels use `fee_label_text` and `label_text`. API currency names and draft fields such as `amount` and `description` are unchanged. URL/image content uses `_link`/`_img` when supplied; SVG keys remain `_icon`.

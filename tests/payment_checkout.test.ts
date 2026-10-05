import assert from "node:assert/strict";
import { test } from "node:test";
import { ref } from "vue";
import PaymentCheckoutUtil from "../src/version_3/utils/payment_checkout_util";
import PaymentCheckoutUIActionHandler from "../src/version_3/action_handlers/payment_checkout_ui_action_handler";
import PaymentCheckoutUIPropsBuilder from "../src/version_3/props_builder/payment_checkout_ui_props_builder";
import type BaseController from "../src/version_3/base_classes/base_controller";
import type {
    PaymentCheckoutTransactionInterface,
    PaymentNextActionType
} from "../src/version_3/types/payment_checkout_type";
import type {
    PaymentCheckoutUIPropsInterface,
    PaymentCheckoutStateInterface,
    PaymentCheckoutComputedInterface,
    PaymentCheckoutComponentsInterface
} from "../src/version_3/ui_types/payment_checkout_ui_type";

const redirect_action: PaymentNextActionType = {
    type: "redirect",
    url: "https://checkout.example.test/session",
    access_code: "code"
};

// Method to produce a backend transaction independently of the provider SDK.
function transaction(next_action: PaymentNextActionType): PaymentCheckoutTransactionInterface {
    return { public_id: "TX", status: "pending", outcome: "pending", next_action };
}

// Method to mount handler state without invoking browser APIs or real payment providers.
function setup() {
    const props = PaymentCheckoutUIPropsBuilder.getDefaults();
    props.transaction = transaction(redirect_action);
    props.content_props.launch_error_text = "launch failed";
    const state_refs = {
        now: ref(Date.now()),
        iframe_url: ref(""),
        started_transaction_id: ref(""),
        is_launching: ref(false),
        error_text: ref("")
    };
    const controller = { name: "checkout", props, state_refs } as unknown as BaseController<
        PaymentCheckoutUIPropsInterface,
        PaymentCheckoutStateInterface,
        PaymentCheckoutComputedInterface,
        PaymentCheckoutComponentsInterface
    >;
    return { props, state_refs, handler: new PaymentCheckoutUIActionHandler(controller) };
}

test("checkout URLs reject executable schemes, credentials, malformed URLs, and disallowed origins", () => {
    const config = PaymentCheckoutUIPropsBuilder.getDefaults().config;
    for (const url of [
        "javascript:alert(1)",
        "data:text/html,test",
        "http://checkout.example.test",
        "https://user:password@checkout.example.test",
        "/relative"
    ]) {
        assert.equal(PaymentCheckoutUtil.getCheckoutLink({ ...redirect_action, url }, config), "");
    }
    config.allowed_origins = ["https://approved.example.test"];
    assert.equal(PaymentCheckoutUtil.getCheckoutLink(redirect_action, config), "");
    config.allowed_origins = ["https://checkout.example.test"];
    assert.equal(PaymentCheckoutUtil.getCheckoutLink(redirect_action, config), redirect_action.url);
});

test("expired or invalid bank expiry hides payment instructions immediately", () => {
    const action: PaymentNextActionType = {
        type: "bank_transfer",
        amount: "9007199254740993.12",
        currency_code: "NGN",
        account_number: "00123",
        account_name: null,
        bank_name: null,
        bank_code: null,
        expires_at: "2030-01-01T00:00:00Z"
    };
    assert.equal(PaymentCheckoutUtil.getAction(transaction(action), Date.parse("2029-01-01")).type, "bank_transfer");
    assert.deepEqual(PaymentCheckoutUtil.getAction(transaction(action), Date.parse("2030-01-01")), {
        type: "pending",
        reason: "instructions_expired"
    });
    assert.equal(
        PaymentCheckoutUtil.getAction(transaction({ ...action, expires_at: "invalid" }), Date.now()).type,
        "pending"
    );
});

test("terminal and review states suppress stale redirect and transfer instructions", () => {
    for (const outcome of ["success", "failed", "cancelled", "expired"] as const) {
        assert.deepEqual(PaymentCheckoutUtil.getAction({ ...transaction(redirect_action), outcome }, Date.now()), {
            type: "none"
        });
    }
    assert.deepEqual(
        PaymentCheckoutUtil.getAction({ ...transaction(redirect_action), outcome: "review" }, Date.now()),
        { type: "pending", reason: "payment_review_required" }
    );
});

test("iframe launch needs explicit origin opt-in and preserves the hosted-link fallback", async () => {
    const view = setup();
    view.props.config.mode = "iframe";
    await view.handler.launch();
    assert.equal(view.state_refs.iframe_url.value, "");
    assert.equal(view.state_refs.error_text.value, "launch failed");
    view.props.config.iframe_origins = ["https://checkout.example.test"];
    await view.handler.launch();
    assert.equal(view.state_refs.iframe_url.value, redirect_action.url);
});

test("SDK completion requests backend refresh but never infers success", async () => {
    const view = setup();
    let refreshes = 0;
    view.props.config.mode = "sdk";
    view.props.config.launch_sdk = async (action, record) => {
        assert.equal(action.access_code, "code");
        assert.equal(record.public_id, "TX");
    };
    view.props.action_props.on_refresh = async () => {
        refreshes++;
    };
    await view.handler.launch();
    assert.equal(refreshes, 1);
    assert.equal(view.props.transaction?.outcome, "pending");
});

test("SDK errors release the launcher and closing suppresses delayed callbacks", async () => {
    const view = setup();
    view.props.config.mode = "sdk";
    view.props.config.launch_sdk = async () => {
        throw new Error("provider closed");
    };
    await view.handler.launch();
    assert.equal(view.state_refs.is_launching.value, false);
    assert.equal(view.state_refs.error_text.value, "launch failed");
    let done!: () => void;
    let refreshes = 0;
    view.props.config.launch_sdk = async () => {
        return new Promise((resolve) => {
            done = resolve;
        });
    };
    view.props.action_props.on_refresh = async () => {
        refreshes++;
    };
    const pending = view.handler.launch();
    view.handler.cleanup();
    done();
    await pending;
    assert.equal(refreshes, 0);
});

test("double status checks share the in-flight guard", async () => {
    const view = setup();
    view.handler.markCheckoutStarted();
    let done!: () => void;
    let refreshes = 0;
    view.props.action_props.on_refresh = async () => {
        refreshes++;
        return new Promise((resolve) => {
            done = resolve;
        });
    };
    const pending = view.handler.refresh();
    await view.handler.refresh();
    assert.equal(refreshes, 1);
    done();
    await pending;
    assert.equal(view.state_refs.is_launching.value, false);
});

test("hosted status checks require checkout activation for the same transaction", async () => {
    const { props, state_refs, handler } = setup();
    let checks = 0;
    props.action_props.on_refresh = async () => {
        checks += 1;
    };
    assert.equal(PaymentCheckoutUtil.canRefresh(props.transaction, state_refs.started_transaction_id.value), false);
    await handler.refresh();
    assert.equal(checks, 0);
    handler.markCheckoutStarted();
    assert.equal(PaymentCheckoutUtil.canRefresh(props.transaction, state_refs.started_transaction_id.value), true);
    await handler.refresh();
    assert.equal(checks, 1);
    props.transaction = { ...transaction(redirect_action), public_id: "OTHER" };
    assert.equal(PaymentCheckoutUtil.canRefresh(props.transaction, state_refs.started_transaction_id.value), false);
    props.transaction = { ...transaction(redirect_action), outcome: "success" };
    assert.equal(PaymentCheckoutUtil.canRefresh(props.transaction, state_refs.started_transaction_id.value), false);
});

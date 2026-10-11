import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";
import { computed, ref } from "vue";
import Handler from "../src/version_3/action_handlers/withdrawal_recipient_form_ui_action_handler";
import Builder from "../src/version_3/props_builder/withdrawal_recipient_form_ui_props_builder";
import Util from "../src/version_3/utils/withdrawal_recipient_form_util";
import type ControllerType from "../src/version_3/controllers/withdrawal_recipient_form_ui_controller";
import type { RecipientFormUIPropsInterface } from "../src/version_3/ui_types/withdrawal_recipient_form_ui_type";
registerHooks({
    load(url, context, next_load) {
        if (url.endsWith(".vue")) {
            return { format: "module", source: "export default {};", shortCircuit: true };
        }
        return next_load(url, context);
    }
});
const Controller = require("../src/version_3/controllers/withdrawal_recipient_form_ui_controller").default;
// Method to exercise the actual computed renderer and action handler without mounting a browser.
function setup(overrides: Partial<RecipientFormUIPropsInterface> = {}) {
    const props = Builder.getDefaults();
    Object.assign(
        props,
        {
            currencies: [
                { code: "NGN", name: "Naira", is_fiat: true },
                { code: "GBP", name: "Pound", is_fiat: true }
            ]
        },
        overrides
    );
    const controller = Object.create(Controller.prototype) as ControllerType;
    Object.assign(controller, { name: "test", props, state_refs: {}, computed_refs: {} });
    const state = Controller.prototype.getUIStateData.call(controller);
    Object.assign(
        controller.state_refs,
        Object.fromEntries(
            Object.entries(state).map(([key, value]) => {
                return [key, ref(value)];
            })
        )
    );
    controller.action_handler = new Handler(controller);
    const definitions = Controller.prototype.getUIComputedData.call(controller);
    Object.assign(
        controller.computed_refs,
        Object.fromEntries(
            Object.entries(definitions).map(([key, getter]) => {
                return [key, computed(getter as () => unknown)];
            })
        )
    );
    return controller;
}
test("new form reveals fields only after currency, holder and scope; bank options load at the final stage", async () => {
    let lookups = 0;
    const c = setup({
        action_props: {
            load_banks: async () => {
                lookups++;
                return [{ code: "001", name: "Test bank" }];
            }
        }
    });
    await c.action_handler.initialize();
    assert.equal(c.state_refs.values.value.currency_id, "");
    assert.deepEqual(c.computed_refs.fields.value, []);
    assert.equal(c.computed_refs.currency_group.value.input_props?.type, "select");
    await c.action_handler.change("currency_id", "NGN");
    assert.equal(c.computed_refs.holder_ready.value, false);
    assert.equal(lookups, 0);
    await c.action_handler.change("account_holder_type", "personal");
    assert.equal(c.computed_refs.holder_ready.value, true);
    assert.deepEqual(c.computed_refs.fields.value, []);
    await c.action_handler.change("bank_account_scope", "local");
    assert.equal(c.computed_refs.details_ready.value, true);
    assert.equal(lookups, 1);
    assert.equal(
        c.computed_refs.fields.value.find((field) => {
            return field.key === "bank_code";
        })?.control,
        "select"
    );
    await c.action_handler.change("currency_id", "GBP");
    await c.action_handler.change("account_holder_type", "business");
    await c.action_handler.change("bank_account_scope", "local");
    assert.equal(lookups, 1);
    assert.equal(
        c.computed_refs.fields.value.find((field) => {
            return field.key === "bank_name";
        })?.control,
        "text"
    );
    assert.equal(c.state_refs.values.value.bank_code, undefined);
});
test("edit holder selection preserves locked scope and omitted saved secrets", async () => {
    const c = setup({
        mode: "edit",
        initial_values: { currency_id: "GBP", bank_account_scope: "local", account_name: "Saved" },
        readonly_fields: ["currency_id", "bank_account_scope"],
        stored_fields: ["account_number", "sort_code"]
    });
    await c.action_handler.initialize();
    await c.action_handler.change("account_holder_type", "business");
    assert.equal(c.state_refs.values.value.bank_account_scope, "local");
    assert.equal(c.state_refs.values.value.account_name, "Saved");
    const payload = Util.buildFormPayload(
        c.state_refs.values.value,
        c.props.initial_values,
        c.computed_refs.fields.value,
        true
    );
    assert.deepEqual(payload, { account_holder_type: "business", recipient_type: "bank_account" });
    assert.equal(payload.account_number, undefined);
});

test("tab selectors may remain unselected until an explicit choice", () => {
    const TabsController = require("../src/version_3/controllers/tabs_ui_controller").default;
    const controller = Object.create(TabsController.prototype);
    controller.props = {
        boolean_props: { allow_empty_selection: true },
        data_props: { active_tab_key: "" },
        content_props: {
            tab_items: [
                { tab_key: "local", label_text: "Local" },
                { tab_key: "international", label_text: "International" }
            ]
        }
    };
    assert.equal(controller.resolveActiveTabKey(), "");
    controller.props.data_props.active_tab_key = "international";
    assert.equal(controller.resolveActiveTabKey(), "international");
});

// Method to wait for the zero-delay test debounce without contacting a real provider.
async function flushResolution(): Promise<void> {
    await new Promise((resolve) => {
        setTimeout(resolve, 15);
    });
}
// Method to prepare an enabled NGN form for resolution tests.
async function prepareResolution(
    action: NonNullable<RecipientFormUIPropsInterface["action_props"]["resolve_account"]>
) {
    const c = setup({
        action_props: {
            resolve_account: action,
            load_banks: async () => {
                return [{ code: "001", name: "Bank" }];
            }
        }
    });
    c.props.rendering_schema.NGN.account_resolution!.debounce_ms = 0;
    await c.action_handler.initialize();
    await c.action_handler.change("currency_id", "NGN");
    await c.action_handler.change("account_holder_type", "personal");
    await c.action_handler.change("bank_account_scope", "local");
    return c;
}
test("automatic resolution waits for exact digits, keeps input editable and retries errors inline", async () => {
    let calls = 0;
    const c = await prepareResolution(async (input) => {
        calls++;
        assert.equal(input.bank_code, "001");
        assert.equal(input.account_number, "0123456789");
        if (calls === 1) {
            throw new Error("Provider failed");
        }
        return { account_name: "Resolved" };
    });
    await c.action_handler.change("bank_code", "001");
    await c.action_handler.change("account_number", "012345678");
    await flushResolution();
    assert.equal(calls, 0);
    await c.action_handler.change("account_number", "0123456789");
    assert.equal(c.state_refs.is_resolving.value, true);
    assert.equal(c.computed_refs.is_busy.value, false);
    await flushResolution();
    assert.equal(calls, 1);
    assert.ok(c.state_refs.resolution_error_text.value);
    assert.equal(c.state_refs.error_text.value, "");
    await c.action_handler.resolve();
    assert.equal(c.state_refs.values.value.account_name, "Resolved");
    assert.equal(c.state_refs.resolution_error_text.value, "");
    await c.action_handler.change("account_number", "01234567890");
    assert.equal(c.state_refs.values.value.account_name, undefined);
    await flushResolution();
    assert.equal(calls, 2);
    c.action_handler.cleanup();
});
test("changed destinations discard stale results and serialize the latest request", async () => {
    let release!: (value: { account_name: string }) => void;
    let calls = 0;
    const c = await prepareResolution(async () => {
        calls++;
        if (calls === 1) {
            return await new Promise<{ account_name: string }>((resolve) => {
                release = resolve;
            });
        }
        return { account_name: "Latest" };
    });
    await c.action_handler.change("bank_code", "001");
    await c.action_handler.change("account_number", "0123456789");
    await flushResolution();
    await c.action_handler.change("bank_code", "002");
    await flushResolution();
    assert.equal(calls, 1);
    release({ account_name: "Stale" });
    await flushResolution();
    assert.equal(calls, 2);
    assert.equal(c.state_refs.values.value.account_name, "Latest");
    c.action_handler.cleanup();
});
test("disabled currencies never resolve and enabled alternate identifiers are forwarded", async () => {
    const inputs: unknown[] = [];
    const c = setup({
        action_props: {
            resolve_account: async (input) => {
                inputs.push(input);
                return { account_name: "Holder" };
            }
        }
    });
    await c.action_handler.initialize();
    await c.action_handler.change("currency_id", "GBP");
    await c.action_handler.change("account_holder_type", "personal");
    await c.action_handler.change("bank_account_scope", "local");
    await c.action_handler.change("sort_code", "012345");
    await c.action_handler.change("account_number", "01234567");
    await flushResolution();
    assert.equal(inputs.length, 0);
    c.props.rendering_schema.GBP.account_resolution = {
        enabled: true,
        bank_identifier: "sort_code",
        account_number_digits: 8,
        debounce_ms: 0
    };
    await c.action_handler.change("sort_code", "012346");
    await flushResolution();
    assert.deepEqual(inputs, [{ currency_code: "GBP", account_number: "01234567", sort_code: "012346" }]);
    await c.action_handler.change("sort_code", "012347");
    c.action_handler.cleanup();
    await flushResolution();
    assert.equal(inputs.length, 1);
});

// Method to populate a valid manual bank destination for validation tests.
async function prepareValidGBP(overrides: Partial<RecipientFormUIPropsInterface> = {}) {
    const c = setup(overrides);
    await c.action_handler.initialize();
    for (const [key, value] of Object.entries({
        currency_id: "GBP",
        account_holder_type: "personal",
        bank_account_scope: "local",
        bank_name: "Bank",
        account_name: "Member",
        account_number: "01234567",
        sort_code: "012345",
        bank_account_type: "checking"
    })) {
        await c.action_handler.change(
            key as import("../src/version_3/types/withdrawal_recipient_form_type").RecipientFieldKeyType,
            value
        );
    }
    return c;
}
test("inline errors appear on input and clear when valid; invalid required or optional fields block review", async () => {
    const c = await prepareValidGBP();
    assert.equal(c.computed_refs.can_submit.value, true);
    assert.equal(c.computed_refs.continue_button.value.boolean_props?.disabled, false);
    const invalid = await c.action_handler.change("sort_code", "12");
    assert.equal(invalid.status, false);
    assert.equal(invalid.msg, "Enter exactly 6 digits.");
    assert.equal(c.computed_refs.can_submit.value, false);
    const group = c.computed_refs.groups.value.find((group) => {
        return group.props.id.endsWith("sort_code_group");
    });
    assert.equal(group?.props.input_props?.validation_error_text, invalid.msg);
    await c.action_handler.change("sort_code", "012345");
    assert.equal(c.action_handler.getFieldError("sort_code"), "");
    await c.action_handler.change("description", "x".repeat(501));
    assert.equal(c.computed_refs.can_submit.value, false);
    await c.action_handler.change("description", "");
    assert.equal(c.computed_refs.can_submit.value, true);
    await c.action_handler.change("account_name", " ");
    assert.equal(c.action_handler.getFieldError("account_name"), "This field is required.");
    await c.action_handler.change("bank_account_scope", "international");
    assert.equal(c.state_refs.validation_results.value.sort_code, undefined);
    assert.equal(c.action_handler.getFieldError("iban"), "");
    assert.equal(c.computed_refs.can_submit.value, false);
});
test("host validator replaces format rules but cannot bypass required values; submit uses the same results", async () => {
    let saves = 0;
    const c = await prepareValidGBP({
        action_props: {
            validators: {
                sort_code: (value) => {
                    return { status: value === "CUSTOM", msg: "Use the custom code." };
                },
                account_name: () => {
                    return { status: true, msg: "" };
                }
            },
            submit: async () => {
                saves++;
            }
        }
    });
    assert.equal(c.computed_refs.can_submit.value, false);
    await c.action_handler.change("sort_code", "CUSTOM");
    assert.equal(c.computed_refs.can_submit.value, true);
    await c.action_handler.change("account_name", "");
    assert.equal(c.computed_refs.can_submit.value, false);
    await c.action_handler.change("account_name", "Member");
    await c.action_handler.submit();
    assert.equal(c.state_refs.is_review.value, true);
    assert.equal(saves, 0);
    await c.action_handler.submit();
    assert.equal(saves, 1);
});
test("slow host validation cannot overwrite a newer result", async () => {
    const c = await prepareValidGBP();
    let release!: (result: { status: boolean; msg: string }) => void;
    c.props.action_props.validators = {
        account_name: async (value) => {
            if (value === "Old") {
                return await new Promise((resolve) => {
                    release = resolve;
                });
            }
            return { status: true, msg: "" };
        }
    };
    const old = c.action_handler.change("account_name", "Old");
    assert.equal(c.state_refs.is_validating.value, true);
    assert.equal(c.computed_refs.can_submit.value, false);
    await c.action_handler.change("account_name", "New");
    release({ status: false, msg: "Stale error" });
    await old;
    assert.equal(c.action_handler.getFieldError("account_name"), "");
    assert.equal(c.computed_refs.can_submit.value, true);
});
test("unchanged masked fields stay valid on edit while replacements are validated", async () => {
    const c = setup({
        mode: "edit",
        initial_values: {
            currency_id: "GBP",
            account_holder_type: "personal",
            recipient_type: "bank_account",
            bank_account_scope: "local",
            bank_name: "Bank",
            account_name: "Member",
            bank_account_type: "checking"
        },
        stored_fields: ["account_number", "sort_code"]
    });
    await c.action_handler.initialize();
    assert.equal(c.computed_refs.can_submit.value, false);
    await c.action_handler.change("description", "Updated");
    assert.equal(c.computed_refs.can_submit.value, true);
    await c.action_handler.change("sort_code", "12");
    assert.equal(c.computed_refs.can_submit.value, false);
});

test("banking inputs defer errors until blur, then revalidate corrections and normalize submission", async () => {
    let saved: unknown;
    const c = await prepareValidGBP({
        action_props: { submit: async (payload) => { saved = payload; } }
    });

    await c.action_handler.change("bank_account_scope", "international");
    await c.action_handler.change("bank_name", "Bank");
    await c.action_handler.change("account_name", "Member");

    const group = c.computed_refs.groups.value.find((item) => item.props.input_props?.id === `${c.props.id}_iban`);
    const on_change = group!.props.input_props!.action_props!.on_change!;

    await on_change(undefined, "gb83 west 1234 5698 7654 32");
    assert.equal(c.action_handler.getFieldError("iban"), "");
    assert.equal(c.computed_refs.can_submit.value, false);

    await c.action_handler.blurIdentifier({
        target: { id: `${c.props.id}_iban` }
    } as unknown as FocusEvent);
    assert.match(c.action_handler.getFieldError("iban"), /checksum/);
    assert.equal(c.state_refs.values.value.iban, "GB83 WEST 1234 5698 7654 32");

    await on_change(undefined, "gb82 west 1234 5698 7654 32");
    assert.equal(c.action_handler.getFieldError("iban"), "");
    await c.action_handler.change("swift_code", "westgb2l");
    assert.equal(c.computed_refs.can_submit.value, true);

    await c.action_handler.submit();
    assert.equal(c.state_refs.is_review.value, true);
    await c.action_handler.submit();
    assert.equal((saved as { iban: string }).iban, "GB82WEST12345698765432");
    assert.equal((saved as { swift_code: string }).swift_code, "WESTGB2L");
});

test("translated save errors remain visible and preserve the reviewed draft", async () => {
    const message = "A recipient with these account details already exists.";
    const c = await prepareValidGBP({
        action_props: {
            submit: async () => {
                throw new Error(message);
            }
        }
    });
    const draft = { ...c.state_refs.values.value };

    await c.action_handler.submit();
    await c.action_handler.submit();

    assert.equal(c.state_refs.error_text.value, message);
    assert.equal(c.state_refs.is_review.value, true);
    assert.equal(c.state_refs.is_submitting.value, false);
    assert.deepEqual(c.state_refs.values.value, draft);
});

test("NGN international can be reviewed without IBAN but validates it when supplied", async () => {
    const c = await prepareResolution(async () => {
        return { account_name: "Resolved" };
    });

    await c.action_handler.change("bank_account_scope", "international");
    await c.action_handler.change("bank_code", "001");
    await c.action_handler.change("account_number", "0123456789");
    await flushResolution();
    await c.action_handler.change("bank_account_type", "savings");
    await c.action_handler.change("swift_code", "GTBINGLA");

    assert.equal(c.state_refs.values.value.iban, undefined);
    assert.equal(c.computed_refs.can_submit.value, true);

    await c.action_handler.change("iban", "invalid");
    assert.equal(c.computed_refs.can_submit.value, false);
    await c.action_handler.change("iban", "");
    assert.equal(c.computed_refs.can_submit.value, true);

    await c.action_handler.submit();
    assert.equal(c.state_refs.is_review.value, true);
    c.action_handler.cleanup();
});

test("GBP international still requires IBAN and USD does not expose it", async () => {
    const c = await prepareValidGBP();
    await c.action_handler.change("bank_account_scope", "international");

    assert.equal(c.computed_refs.fields.value.find((field) => {
        return field.key === "iban";
    })?.required, true);

    assert.equal(c.props.rendering_schema.USD.category_selector?.options.international.fields.some((field) => {
        return field.key === "iban";
    }), false);
});

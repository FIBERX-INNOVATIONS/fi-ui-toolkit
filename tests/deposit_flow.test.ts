import DepositIntentRejectedError from "../src/version_3/utils/deposit_intent_rejected_error";
import assert from "node:assert/strict";
import { test } from "node:test";
import { ref } from "vue";
import DecimalAmountUtil from "../src/version_3/utils/decimal_amount_util";
import DepositFlowUIActionHandler from "../src/version_3/action_handlers/deposit_flow_ui_action_handler";
import type BaseController from "../src/version_3/base_classes/base_controller";
import type {
    DepositFlowUIPropsInterface,
    DepositFlowStateInterface,
    DepositFlowComputedInterface,
    DepositFlowComponentsInterface
} from "../src/version_3/ui_types/deposit_flow_ui_type";
import type {
    DepositActionsInterface,
    DepositContextInterface,
    DepositCacheInterface,
    TransactionIntentInterface
} from "../src/version_3/types/deposit_flow_type";
import type { StateRefsType } from "../src/version_3/types/base_type";

// Method to return a deterministic server-style review result.
function intent(context: DepositContextInterface): TransactionIntentInterface {
    return {
        public_id: "TEST-INTENT",
        currency_code: context.currency_code,
        amount: context.amount,
        description: context.description,
        fee_amount: "1.00",
        net_amount: "9.00"
    };
}
// Method to test the coordinator independently of Vue lifecycle hooks and real APIs.
function setup(overrides: Partial<DepositActionsInterface> = {}, initial_cache: DepositCacheInterface | null = null) {
    let saved = initial_cache;
    let creates = 0;
    let updates = 0;
    const contexts: DepositContextInterface[] = [];
    const props = {
        currencies: [{ code: "NGN", name: "Naira", precision: 2 }],
        content_props: {
            request_error_text: "request failed",
            storage_error_text: "storage failed",
            update_unavailable_text: "update unavailable",
            provisioning_unavailable_text: "provisioning unavailable"
        },
        storage: {
            load: () => {
                return saved;
            },
            save: (cache: DepositCacheInterface) => {
                saved = JSON.parse(JSON.stringify(cache));
            }
        },
        action_props: {
            fetch_providers: async () => {
                return [{ id: "provider", name: "Provider", methods: [{ id: "method", name: "Method" }] }];
            },
            create_intent: async (context: DepositContextInterface, key: string) => {
                assert.equal(key, "stable-key");
                creates++;
                contexts.push(context);
                return intent(context);
            },
            update_intent: async (id: string, context: DepositContextInterface) => {
                assert.equal(id, "TEST-INTENT");
                updates++;
                contexts.push(context);
                return intent(context);
            },
            ...overrides
        }
    } as unknown as DepositFlowUIPropsInterface;
    const state: DepositFlowStateInterface = {
        step: "details",
        currencies: [],
        details: { currency_code: "NGN", amount: "10.00", description: "Deposit" },
        providers: [],
        methods: [],
        provider_id: "",
        method_id: "",
        intent: null,
        is_loading: false,
        is_ready: false,
        error_text: "",
        cache: { version: 1, request_key: "stable-key", accounts: {} }
    };
    const state_refs = Object.fromEntries(
        Object.entries(state).map(([key, value]) => {
            return [key, ref(value)];
        })
    ) as StateRefsType<DepositFlowStateInterface>;
    const controller = { props, state_refs, name: "test" } as unknown as BaseController<
        DepositFlowUIPropsInterface,
        DepositFlowStateInterface,
        DepositFlowComputedInterface,
        DepositFlowComponentsInterface
    >;
    const handler = new DepositFlowUIActionHandler(controller);
    return {
        handler,
        props,
        state_refs,
        contexts,
        getSaved: () => {
            return saved;
        },
        getCounts: () => {
            return { creates, updates };
        }
    };
}
// Method to advance mock details through provider and method selection.
async function advance(flow: ReturnType<typeof setup>, amount = "10.00"): Promise<void> {
    await flow.handler.submitDetails({ currency_code: "NGN", amount, description: "Deposit" });
    await flow.handler.selectProvider("provider");
    await flow.handler.selectMethod("method");
}

test("decimal validation preserves exact digits and rejects invalid grouping, precision and non-positive values", () => {
    assert.equal(DecimalAmountUtil.normalize("9,007,199,254,740,993.12", 2), "9007199254740993.12");
    assert.equal(DecimalAmountUtil.group("9007199254740993.12"), "9,007,199,254,740,993.12");
    for (const input of ["1,2", "1e3", "-1", "0", "0.00", "1.001", "NaN", "Infinity", "1."]) {
        assert.equal(DecimalAmountUtil.normalize(input, 2), null);
    }
    assert.equal(DecimalAmountUtil.normalize("1.1", 0), null);
    assert.equal(DecimalAmountUtil.normalize("0.00000001", 8), "0.00000001");
    assert.equal(DecimalAmountUtil.normalize("1", -1), null);
    assert.equal(DecimalAmountUtil.group("1,2"), "1,2");
});
test("edits update the original intent and unchanged review avoids another mutation", async () => {
    const flow = setup();
    await flow.handler.initialize();
    await advance(flow);
    assert.equal(flow.state_refs.step.value, "review");
    assert.equal(flow.getSaved()?.intent_public_id, "TEST-INTENT");
    flow.handler.back();
    await advance(flow, "20.00");
    assert.deepEqual(flow.getCounts(), { creates: 1, updates: 1 });
    assert.equal(flow.state_refs.intent.value?.amount, "20.00");
    flow.handler.back();
    await advance(flow, "20.00");
    assert.deepEqual(flow.getCounts(), { creates: 1, updates: 1 });
});
test("failed creates retry with the original reference and reject changed payloads", async () => {
    const keys: string[] = [];
    const flow = setup({
        create_intent: async (_context, key) => {
            keys.push(key);
            throw new Error("lost response");
        }
    });
    await flow.handler.initialize();
    await advance(flow);
    await flow.handler.selectMethod("method");
    assert.deepEqual(keys, ["stable-key", "stable-key"]);
    await advance(flow, "20.00");
    assert.equal(keys.length, 2);
    assert.equal(flow.state_refs.error_text.value, "update unavailable");
});
test("missing update callbacks never fall back to creating another intent", async () => {
    const flow = setup({ update_intent: undefined });
    await flow.handler.initialize();
    await advance(flow);
    await advance(flow, "20.00");
    assert.equal(flow.getCounts().creates, 1);
    assert.equal(flow.state_refs.error_text.value, "update unavailable");
});
test("provisions at the method stage and caches only the returned account identifier", async () => {
    const calls: (string | undefined)[] = [];
    const flow = setup({
        fetch_providers: async () => {
            return [
                {
                    id: "provider",
                    name: "Provider",
                    provisioning: { stage: "method", cache_key: "configuration-v1" },
                    methods: [{ id: "method", name: "Method" }]
                }
            ];
        },
        ensure_account: async (context, cached_id) => {
            assert.equal(context.payment_method_id, "method");
            calls.push(cached_id);
            return "ACCOUNT-1";
        }
    });
    await flow.handler.initialize();
    await advance(flow);
    await advance(flow, "20.00");
    assert.deepEqual(calls, [undefined, "ACCOUNT-1"]);
    assert.equal(flow.contexts[0].provider_account_id, "ACCOUNT-1");
});
test("required provisioning without an adapter blocks the intent", async () => {
    const flow = setup({
        fetch_providers: async () => {
            return [
                {
                    id: "provider",
                    name: "Provider",
                    provisioning: { stage: "provider", cache_key: "config" },
                    methods: [{ id: "method", name: "Method" }]
                }
            ];
        }
    });
    await flow.handler.initialize();
    await advance(flow);
    assert.equal(flow.getCounts().creates, 0);
    assert.equal(flow.state_refs.error_text.value, "provisioning unavailable");
});
test("storage failure prevents mutation and successful responses can retry persistence without a second mutation", async () => {
    const flow = setup();
    await flow.handler.initialize();
    await flow.handler.submitDetails({ currency_code: "NGN", amount: "10.00", description: "Deposit" });
    await flow.handler.selectProvider("provider");
    const save = flow.props.storage.save;
    flow.props.storage.save = () => {
        throw new Error("storage denied");
    };
    await flow.handler.selectMethod("method");
    assert.equal(flow.getCounts().creates, 0);
    flow.props.storage.save = (cache) => {
        if (cache.intent_public_id) {
            throw new Error("quota");
        }
        save(cache);
    };
    await flow.handler.selectMethod("method");
    assert.equal(flow.getCounts().creates, 1);
    flow.props.storage.save = save;
    await flow.handler.selectMethod("method");
    assert.deepEqual(flow.getCounts(), { creates: 1, updates: 0 });
    assert.equal(flow.state_refs.step.value, "review");
});
test("a cached draft is restored through the host read adapter", async () => {
    const first = setup();
    await first.handler.initialize();
    await advance(first);
    const restored = setup(
        {
            read_intent: async (id) => {
                assert.equal(id, "TEST-INTENT");
                return intent(first.contexts[0]);
            }
        },
        first.getSaved()
    );
    await restored.handler.initialize();
    assert.equal(restored.state_refs.step.value, "review");
    assert.equal(restored.getCounts().creates, 0);
});
test("closing a flow while providers load suppresses subsequent navigation", async () => {
    let resolve!: (value: []) => void;
    const flow = setup({
        fetch_providers: () => {
            return new Promise((done) => {
                resolve = done;
            });
        }
    });
    await flow.handler.initialize();
    const pending = flow.handler.submitDetails({ currency_code: "NGN", amount: "10", description: "Deposit" });
    flow.handler.cleanup();
    resolve([]);
    await pending;
    assert.equal(flow.state_refs.step.value, "details");
});

test("server decimal scale is normalized only when no significant digits are lost", () => {
    assert.equal(DecimalAmountUtil.withPrecision("9007199254740993.120000000000", 2), "9007199254740993.12");
    assert.equal(DecimalAmountUtil.withPrecision("10", 2), "10.00");
    assert.equal(DecimalAmountUtil.withPrecision("10.0000", 0), "10");
    assert.equal(DecimalAmountUtil.withPrecision("10.001", 2), null);
});
test("restored edit fields come from the server rather than an outdated cached snapshot", async () => {
    const first = setup();
    await first.handler.initialize();
    await advance(first);
    const restored = setup(
        {
            read_intent: async () => {
                return { ...intent(first.contexts[0]), amount: "30.00", description: "Updated elsewhere" };
            }
        },
        first.getSaved()
    );
    await restored.handler.initialize();
    restored.handler.back();
    assert.equal(restored.state_refs.details.value.amount, "30.00");
    assert.equal(restored.state_refs.details.value.description, "Updated elsewhere");
});

test("definitive server rejection permits correction while uncertain failures remain frozen", async () => {
    const submitted: string[] = [];
    const flow = setup({
        create_intent: async (context) => {
            submitted.push(context.amount);
            if (context.amount === "10.00") {
                throw new DepositIntentRejectedError("Rejected");
            }
            return intent(context);
        }
    });
    await flow.handler.initialize();
    await advance(flow);
    assert.equal(flow.getSaved()?.submitted_context, undefined);
    await advance(flow, "20.00");
    assert.deepEqual(submitted, ["10.00", "20.00"]);
    assert.equal(flow.state_refs.step.value, "review");
});

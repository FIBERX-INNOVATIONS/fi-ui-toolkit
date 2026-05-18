import { ComputedRefsType, StateRefsType } from "./base_type";

export type PropRenderFnType = (
    index: number,
    record: Record<string, unknown>,
    records: Record<string, unknown>[]
) => string | number | null;

export type PropRenderContentFnType = () => string | number | null;

export interface ComponentDefinitionInterface<
    Props extends object = object,
    State extends object = object,
    Computed extends object = object,
    Components extends object = object
> {
    props: Props;
    components: Components;
    state_refs: StateRefsType<State>;
    computed_refs: ComputedRefsType<Computed>;
}

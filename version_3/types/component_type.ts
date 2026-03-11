
export type PropRenderFnType = (
    index: number,
    record: Record<string, any>,
    records: Record<string, any>[]
) => string | number | null;

export type PropRenderContentFnType = () => string | number | null;

export interface ComponentDefinitionInterface {
    props: Record<string, any>;
    components: Record<string, any>;
    state_refs: Record<string, any>;
    computed_refs: Record<string, any>;
}



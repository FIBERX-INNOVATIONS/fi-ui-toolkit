export type PropSchemaKeyType<Props extends object> = Extract<keyof Props, string>;

export type PropSchemaPatchType<Props extends object> = Partial<Props>;

export type FlatPropSchemaPatchType = Record<string, unknown>;

export interface PropSchemaUpdateOptionsInterface<Props extends object> {
    static_keys?: readonly PropSchemaKeyType<Props>[];

    allow_static?: boolean;

    allow_undefined?: boolean;

    merge_objects?: boolean;

    create_missing_path?: boolean;
}

export interface PropSchemaStaticContextInterface<Props extends object> {
    readonly static_prop_keys?: readonly string[];

    readonly dynamic_prop_keys?: readonly string[];
}

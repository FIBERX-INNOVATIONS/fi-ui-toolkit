import { isReactive, markRaw, reactive } from "vue";

import {
    FlatPropSchemaPatchType,
    PropSchemaKeyType,
    PropSchemaPatchType,
    PropSchemaStaticContextInterface,
    PropSchemaUpdateOptionsInterface
} from "../types/prop_schema_type";

type MutableRecordType = Record<string, unknown>;

const isRecord = (value: unknown): value is MutableRecordType => {
    return typeof value === "object" && value !== null && !Array.isArray(value);
};

class BasePropSchema<Props extends object> {
    public static readonly static_prop_keys: readonly string[] = [];

    public static readonly dynamic_prop_keys: readonly string[] = [];

    public static createReactiveProps<Props extends object>(
        this: PropSchemaStaticContextInterface<Props> & typeof BasePropSchema,
        props: Props
    ): Props {
        this.markStaticProps(props);

        return isReactive(props) ? props : (reactive(props) as Props);
    }

    public static updateProp<Props extends object, Key extends PropSchemaKeyType<Props>>(
        this: PropSchemaStaticContextInterface<Props> & typeof BasePropSchema,
        props: Props,
        key: Key,
        value: Props[Key],
        options: PropSchemaUpdateOptionsInterface<Props> = {}
    ): Props {
        return this.updateProps(props, { [key]: value } as unknown as PropSchemaPatchType<Props>, options);
    }

    public static updateProps<Props extends object>(
        this: PropSchemaStaticContextInterface<Props> & typeof BasePropSchema,
        props: Props,
        patch: PropSchemaPatchType<Props>,
        options: PropSchemaUpdateOptionsInterface<Props> = {}
    ): Props {
        const { allow_undefined = false, merge_objects = true } = options;

        for (const [key, value] of Object.entries(patch) as [PropSchemaKeyType<Props>, Props[keyof Props]][]) {
            if (!allow_undefined && value === undefined) {
                continue;
            }

            if (!this.canUpdateKey(key, options)) {
                continue;
            }

            const current_value = props[key];

            if (merge_objects && isRecord(current_value) && isRecord(value)) {
                Object.assign(current_value, value);
                continue;
            }

            props[key] = value as Props[typeof key];
        }

        return props;
    }

    public static updateFlatProps<Props extends object>(
        this: PropSchemaStaticContextInterface<Props> & typeof BasePropSchema,
        props: Props,
        patch: FlatPropSchemaPatchType,
        options: PropSchemaUpdateOptionsInterface<Props> = {}
    ): Props {
        for (const [path, value] of Object.entries(patch)) {
            this.updatePath(props, path, value, options);
        }

        return props;
    }

    public static updatePath<Props extends object>(
        this: PropSchemaStaticContextInterface<Props> & typeof BasePropSchema,
        props: Props,
        path: string | readonly string[],
        value: unknown,
        options: PropSchemaUpdateOptionsInterface<Props> = {}
    ): Props {
        const path_keys = typeof path === "string" ? path.split(".") : path;
        const [root_key, ...nested_keys] = path_keys;

        if (!root_key || !this.canUpdateKey(root_key as PropSchemaKeyType<Props>, options)) {
            return props;
        }

        if (nested_keys.length === 0) {
            return this.updateProps(props, { [root_key]: value } as PropSchemaPatchType<Props>, options);
        }

        let target: MutableRecordType = props as MutableRecordType;

        for (const [index, key] of nested_keys.entries()) {
            const previous_key = index === 0 ? root_key : nested_keys[index - 1];
            const is_last_key = index === nested_keys.length - 1;
            const previous_target = target[previous_key];

            if (!isRecord(previous_target)) {
                if (!options.create_missing_path) {
                    return props;
                }

                target[previous_key] = {};
            }

            target = target[previous_key] as MutableRecordType;

            if (is_last_key) {
                target[key] = value;
            }
        }

        return props;
    }

    private static canUpdateKey<Props extends object>(
        this: PropSchemaStaticContextInterface<Props>,
        key: PropSchemaKeyType<Props>,
        options: PropSchemaUpdateOptionsInterface<Props>
    ): boolean {
        if (options.allow_static) {
            return true;
        }

        const static_keys = options.static_keys ?? this.static_prop_keys ?? [];

        return !static_keys.includes(key);
    }

    private static markStaticProps<Props extends object>(
        this: PropSchemaStaticContextInterface<Props>,
        props: Props
    ): void {
        for (const key of this.static_prop_keys ?? []) {
            const value = props[key as keyof Props];

            if (isRecord(value)) {
                props[key as keyof Props] = markRaw(value) as Props[keyof Props];
            }
        }
    }
}

export default BasePropSchema;

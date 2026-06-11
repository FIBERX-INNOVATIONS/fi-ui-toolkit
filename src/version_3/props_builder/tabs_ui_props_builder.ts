import BasePropSchema from "../base_classes/base_prop_schema";
import ContentManagerUtil from "../utils/content_manager_util";
import TabsUIClassStyles from "../class_styles/tabs_ui_class_styles";

import {
    TabsUIActionPropsInterface,
    TabsUIBooleanPropsInterface,
    TabsUIClassStylesInterface,
    TabsUIContentPathTabItemInterface,
    TabsUIContentPropsInterface,
    TabsUIDataPropsInterface,
    TabsUIPropsInterface,
    TabsUITabItemInterface
} from "../ui_types/tabs_ui_type";

/* Method to build and update reactive TabsUI props. */
class TabsUIPropsBuilder extends BasePropSchema<TabsUIPropsInterface> {
    public static readonly static_prop_keys = [
        "id",
        "content_props",
        "action_props",
        "class_styles"
    ] satisfies readonly (keyof TabsUIPropsInterface)[];

    private static readonly content_manager = ContentManagerUtil.getInstance();

    public static class_styles?: TabsUIClassStylesInterface;

    public static default_boolean_props?: TabsUIBooleanPropsInterface;

    public static default_data_props?: TabsUIDataPropsInterface;

    public static default_action_props?: TabsUIActionPropsInterface;

    /* Method to configure default TabsUI props. */
    public static configure(params: {
        class_styles?: TabsUIClassStylesInterface;
        boolean_props?: TabsUIBooleanPropsInterface;
        data_props?: TabsUIDataPropsInterface;
        action_props?: TabsUIActionPropsInterface;
    }): void {
        TabsUIPropsBuilder.class_styles = params.class_styles || TabsUIClassStyles;
        TabsUIPropsBuilder.default_boolean_props = params.boolean_props || {};
        TabsUIPropsBuilder.default_data_props = params.data_props || {};
        TabsUIPropsBuilder.default_action_props = params.action_props || {};
    }

    /* Method to build the complete TabsUI props object. */
    private static buildPropsObject(
        id: string,
        tab_items: TabsUITabItemInterface[] = [],
        overrides: Partial<TabsUIPropsInterface> = {}
    ): TabsUIPropsInterface {
        return {
            id,

            content_props: {
                tab_items,
                ...overrides.content_props
            },

            data_props: {
                ...TabsUIPropsBuilder.default_data_props,
                ...overrides.data_props
            },

            boolean_props: {
                ...TabsUIPropsBuilder.default_boolean_props,
                ...overrides.boolean_props
            },

            action_props: {
                ...TabsUIPropsBuilder.default_action_props,
                ...overrides.action_props
            },

            class_styles: {
                ...TabsUIClassStyles,
                ...(TabsUIPropsBuilder.class_styles ?? {}),
                ...(overrides.class_styles ?? {})
            }
        };
    }

    /* Method to create reactive TabsUI props from direct values. */
    public static getReactivePropsObject(
        id: string,
        tab_items: TabsUITabItemInterface[] = [],
        overrides: Partial<TabsUIPropsInterface> = {}
    ): TabsUIPropsInterface {
        const props = TabsUIPropsBuilder.buildPropsObject(id, tab_items, overrides);

        return this.createReactiveProps<TabsUIPropsInterface>(props);
    }

    /* Method to create reactive TabsUI props from content manager paths. */
    public static getReactivePropsObjectFromContentPaths(
        id: string,
        tab_items: TabsUIContentPathTabItemInterface[] = [],
        overrides: Partial<TabsUIPropsInterface> = {},
        record: Record<string, any> = {}
    ): TabsUIPropsInterface {
        const props = TabsUIPropsBuilder.buildPropsObject(
            id,
            TabsUIPropsBuilder.getTabItemsFromContentPaths(tab_items, record),
            overrides
        );

        return this.createReactiveProps<TabsUIPropsInterface>(props);
    }

    /* Method to create reactive TabsUI props from a content manager payload. */
    public static getReactivePropsObjectFromContentKey(
        id: string,
        content_key: string,
        overrides: Partial<TabsUIPropsInterface> = {},
        record: Record<string, any> = {}
    ): TabsUIPropsInterface {
        const content_payload =
            TabsUIPropsBuilder.content_manager.get<{
                tab_items?: TabsUIContentPathTabItemInterface[];
            }>(content_key, {}) ?? {};

        return TabsUIPropsBuilder.getReactivePropsObjectFromContentPaths(
            id,
            content_payload.tab_items ?? [],
            overrides,
            record
        );
    }

    /* Method to update the active tab key. */
    public static updateActiveTabKey(props: TabsUIPropsInterface, active_tab_key: string): TabsUIPropsInterface {
        return this.updateFlatProps(
            props,
            {
                "data_props.active_tab_key": active_tab_key
            },
            { create_missing_path: true }
        );
    }

    /* Method to update the tab items. */
    public static updateTabItems(
        props: TabsUIPropsInterface,
        tab_items: TabsUITabItemInterface[]
    ): TabsUIPropsInterface {
        return this.updateFlatProps(
            props,
            {
                "content_props.tab_items": tab_items
            },
            { allow_static: true, create_missing_path: true }
        );
    }

    /* Method to update the disabled state. */
    public static setDisabled(props: TabsUIPropsInterface, disabled: boolean): TabsUIPropsInterface {
        return this.updateFlatProps(
            props,
            {
                "boolean_props.disabled": disabled
            },
            { create_missing_path: true }
        );
    }

    /* Method to fetch tab values from dotted content manager paths. */
    private static getTabItemsFromContentPaths(
        tab_items: TabsUIContentPathTabItemInterface[],
        record: Record<string, any> = {}
    ): TabsUITabItemInterface[] {
        return tab_items.map((tab_item) => ({
            tab_key: tab_item.tab_key,
            label_text: TabsUIPropsBuilder.getTextContent(tab_item.label_text, record),
            tab_icon: TabsUIPropsBuilder.getIconContent(tab_item.tab_icon),
            icon_position: tab_item.icon_position,
            slot_name: tab_item.slot_name,
            disabled: tab_item.disabled
        }));
    }

    /* Method to fetch a string content value. */
    private static getTextContent(content_key?: string, record: Record<string, any> = {}): string {
        if (!content_key) {
            return "";
        }

        return TabsUIPropsBuilder.content_manager.getWithRecord<string>(content_key, record, "") ?? "";
    }

    /* Method to fetch an icon key content value. */
    private static getIconContent(content_key?: string): TabsUITabItemInterface["tab_icon"] {
        if (!content_key) {
            return undefined;
        }

        return (
            TabsUIPropsBuilder.content_manager.get<TabsUITabItemInterface["tab_icon"]>(content_key, undefined) ??
            undefined
        );
    }
}

export default TabsUIPropsBuilder;

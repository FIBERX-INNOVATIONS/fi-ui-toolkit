import BaseController from "../base_classes/base_controller";

import TabsUIActionHandler from "../action_handlers/tabs_ui_action_handler";

import { ComputedDefinitionType, WatchersType } from "../types/base_type";

import {
    TabsUIComponentsInterface,
    TabsUIComputedDataInterface,
    TabsUIPropsInterface,
    TabsUIStateDataInterface,
    TabsUITabItemInterface
} from "../ui_types/tabs_ui_type";

/* Method to manage TabsUI state and computed data. */
class TabsUIController extends BaseController<
    TabsUIPropsInterface,
    TabsUIStateDataInterface,
    TabsUIComputedDataInterface,
    TabsUIComponentsInterface
> {
    public override action_handler: TabsUIActionHandler;

    /* Method to create the controller and action handler. */
    constructor(props: TabsUIPropsInterface) {
        super("tabs_ui", props);

        this.action_handler = new TabsUIActionHandler(this);
        this.setActionHandler(this.action_handler);

        this.getComponentDefinition();
    }

    /* Method to provide child components. */
    protected getUIComponents(): TabsUIComponentsInterface {
        return {};
    }

    /* Method to provide reactive state used by the template. */
    protected getUIStateData(): TabsUIStateDataInterface {
        return {
            active_tab_key: this.resolveActiveTabKey(),
            is_switching: false,
            error_text: null
        };
    }

    /* Method to provide display state derived from props and state. */
    protected getUIComputedData(): ComputedDefinitionType<TabsUIComputedDataInterface> {
        return {
            display_tab_items: (): TabsUITabItemInterface[] => {
                return Array.isArray(this.props.content_props?.tab_items) ? this.props.content_props.tab_items : [];
            },

            has_tabs: (): boolean => {
                return this.computed_refs.display_tab_items.value.length > 0;
            },

            active_tab_item: (): TabsUITabItemInterface | null => {
                return (
                    this.computed_refs.display_tab_items.value.find((tab_item) => this.isTabActive(tab_item.tab_key)) ??
                    null
                );
            }
        };
    }

    /* Method to keep active tab state aligned with parent-owned props. */
    protected getUIWatchers(): WatchersType<TabsUIPropsInterface, TabsUIStateDataInterface> {
        return {
            data_props: {
                handler: () => {
                    const active_tab_key = this.resolveActiveTabKey();

                    if (active_tab_key) {
                        this.state_refs.active_tab_key.value = active_tab_key;
                    }
                },
                options: { deep: true }
            },

            content_props: {
                handler: () => {
                    const active_tab_exists = this.getTabItems().some((tab_item) => this.isTabActive(tab_item.tab_key));

                    if (!active_tab_exists) {
                        this.state_refs.active_tab_key.value = this.resolveActiveTabKey();
                    }
                },
                options: { deep: true }
            }
        };
    }

    /* Method to check whether a tab is currently active. */
    public isTabActive = (tab_key: string): boolean => {
        return this.state_refs.active_tab_key.value === tab_key;
    };

    /* Method to resolve the named slot for a tab. */
    public getTabSlotName = (tab_item: TabsUITabItemInterface): string => {
        return tab_item.slot_name || tab_item.tab_key;
    };

    /* Method to resolve the button id for a tab. */
    public getTabButtonId = (tab_item: TabsUITabItemInterface): string => {
        return `${this.props.id}_${tab_item.tab_key}_tab`;
    };

    /* Method to resolve the panel id for a tab. */
    public getTabPanelId = (tab_item: TabsUITabItemInterface): string => {
        return `${this.props.id}_${tab_item.tab_key}_panel`;
    };

    /* Method to resolve the display class for a tab button. */
    public getTabButtonClass = (tab_item: TabsUITabItemInterface): string => {
        const { class_styles } = this.props;
        const tab_classes = [class_styles?.tab_button_class_style || ""];

        tab_classes.push(
            this.isTabActive(tab_item.tab_key)
                ? class_styles?.active_tab_button_class_style || ""
                : class_styles?.inactive_tab_button_class_style || ""
        );

        if (this.props.boolean_props?.disabled || tab_item.disabled || this.state_refs.is_switching.value) {
            tab_classes.push(class_styles?.disabled_tab_button_class_style || "");
        }

        return tab_classes.filter(Boolean).join(" ");
    };

    /* Method to resolve the best active tab key from props. */
    private resolveActiveTabKey(): string {
        const tab_items = this.getTabItems();
        const configured_active_tab_key = this.props.data_props?.active_tab_key;
        const configured_active_tab = tab_items.find((tab_item) => tab_item.tab_key === configured_active_tab_key);

        if (configured_active_tab && !configured_active_tab.disabled) {
            return configured_active_tab.tab_key;
        }

        return tab_items.find((tab_item) => !tab_item.disabled)?.tab_key ?? tab_items[0]?.tab_key ?? "";
    }

    /* Method to return normalized tab items from props. */
    private getTabItems(): TabsUITabItemInterface[] {
        return Array.isArray(this.props.content_props?.tab_items) ? this.props.content_props.tab_items : [];
    }
}

export default TabsUIController;

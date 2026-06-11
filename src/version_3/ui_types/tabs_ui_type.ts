import { SVGIconKey } from "../resources/svg_icon_resource";

/* ---------------------------------- */
/* Icon Position                      */
/* ---------------------------------- */

export type TabsUITabIconPositionType = "before" | "after";

/* ---------------------------------- */
/* Action Return                      */
/* ---------------------------------- */

export interface TabsUIActionReturnInterface {
    status: boolean;
    msg: string;
    data?: Record<string, unknown>;
}

/* ---------------------------------- */
/* Tab Item                           */
/* ---------------------------------- */

export interface TabsUITabItemInterface {
    tab_key: string;
    label_text?: string;
    tab_icon?: SVGIconKey;
    icon_position?: TabsUITabIconPositionType;
    slot_name?: string;
    disabled?: boolean;
}

/* ---------------------------------- */
/* Content Path Tab Item              */
/* ---------------------------------- */

export interface TabsUIContentPathTabItemInterface {
    tab_key: string;
    label_text?: string;
    tab_icon?: string;
    icon_position?: TabsUITabIconPositionType;
    slot_name?: string;
    disabled?: boolean;
}

/* ---------------------------------- */
/* Content Props                      */
/* ---------------------------------- */

export interface TabsUIContentPropsInterface {
    tab_items?: TabsUITabItemInterface[];
}

/* ---------------------------------- */
/* Data Props                         */
/* ---------------------------------- */

export interface TabsUIDataPropsInterface {
    active_tab_key?: string;
}

/* ---------------------------------- */
/* Boolean Props                      */
/* ---------------------------------- */

export interface TabsUIBooleanPropsInterface {
    disabled?: boolean;
}

/* ---------------------------------- */
/* Action Props                       */
/* ---------------------------------- */

export interface TabsUIActionPropsInterface {
    on_tab_change?: (
        tab_item?: TabsUITabItemInterface,
        event?: MouseEvent,
        config?: { props: TabsUIPropsInterface }
    ) => Promise<TabsUIActionReturnInterface | void>;
}

/* ---------------------------------- */
/* Class Styles                       */
/* ---------------------------------- */

export interface TabsUIClassStylesInterface {
    wrapper_class_style: string;
    tabs_list_class_style: string;
    tab_button_class_style: string;
    active_tab_button_class_style: string;
    inactive_tab_button_class_style: string;
    disabled_tab_button_class_style: string;
    tab_icon_class_style: string;
    tab_label_class_style: string;
    panel_wrapper_class_style: string;
    panel_class_style: string;
    error_class_style: string;
}

/* ---------------------------------- */
/* Props Interface                    */
/* ---------------------------------- */

export interface TabsUIPropsInterface {
    id?: string;
    content_props?: TabsUIContentPropsInterface;
    data_props?: TabsUIDataPropsInterface;
    boolean_props?: TabsUIBooleanPropsInterface;
    action_props?: TabsUIActionPropsInterface;
    class_styles?: TabsUIClassStylesInterface;
}

/* ---------------------------------- */
/* State                              */
/* ---------------------------------- */

export interface TabsUIStateDataInterface {
    active_tab_key: string;
    is_switching: boolean;
    error_text: string | null;
}

/* ---------------------------------- */
/* Computed                           */
/* ---------------------------------- */

export interface TabsUIComputedDataInterface {
    display_tab_items: TabsUITabItemInterface[];
    has_tabs: boolean;
    active_tab_item: TabsUITabItemInterface | null;
}

/* ---------------------------------- */
/* Components                         */
/* ---------------------------------- */

export interface TabsUIComponentsInterface {}

import BaseController from "../base_classes/base_controller";

import BaseActionHandler from "../base_classes/base_action_handler";

import {
    TabsUIComponentsInterface,
    TabsUIComputedDataInterface,
    TabsUIPropsInterface,
    TabsUIStateDataInterface,
    TabsUITabItemInterface
} from "../ui_types/tabs_ui_type";

/* Method to handle TabsUI user actions. */
class TabsUIActionHandler extends BaseActionHandler<
    TabsUIPropsInterface,
    TabsUIStateDataInterface,
    TabsUIComputedDataInterface,
    TabsUIComponentsInterface
> {
    /* Method to create the action handler. */
    constructor(
        controller: BaseController<
            TabsUIPropsInterface,
            TabsUIStateDataInterface,
            TabsUIComputedDataInterface,
            TabsUIComponentsInterface
        >
    ) {
        super(controller);
    }

    /* Method to handle tab selection. */
    public handleTabClick = async (tab_item: TabsUITabItemInterface, event: MouseEvent): Promise<void> => {
        if (this.props.boolean_props?.disabled || tab_item.disabled || this.state_refs.is_switching.value) {
            return;
        }

        await this.runWithLoading(
            "is_switching",
            async () => {
                this.setState("active_tab_key", tab_item.tab_key);

                const result = await this.invokeAction(this.props.action_props?.on_tab_change, tab_item, event, {
                    props: this.props
                });

                this.setErrorFromResult(result);
            },
            { prevent_when_loading: true }
        );
    };
}

export default TabsUIActionHandler;

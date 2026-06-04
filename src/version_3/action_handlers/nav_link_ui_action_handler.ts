import BaseActionHandler from "../base_classes/base_action_handler";
import BaseController from "../base_classes/base_controller";

import {
    NavLinkUIComponentsInterface,
    NavLinkUIComputedDataInterface,
    NavLinkUIPropsInterface,
    NavLinkUIStateDataInterface
} from "../ui_types/nav_link_ui_type";

class NavLinkUIActionHandler extends BaseActionHandler<
    NavLinkUIPropsInterface,
    NavLinkUIStateDataInterface,
    NavLinkUIComputedDataInterface,
    NavLinkUIComponentsInterface
> {
    constructor(
        controller: BaseController<
            NavLinkUIPropsInterface,
            NavLinkUIStateDataInterface,
            NavLinkUIComputedDataInterface,
            NavLinkUIComponentsInterface
        >
    ) {
        super(controller);
    }

    public handleOnClick = async (event: MouseEvent): Promise<void> => {
        const { on_click } = this.props.action_props || {};

        await this.invokeAction(on_click, event, { props: this.props });
    };
}

export default NavLinkUIActionHandler;

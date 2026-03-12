
import BaseController from "../base_classes/base_controller";

import { 
    NavLinkUIPropsInterface,
    NavLinkUIStateDataInterface,
    NavLinkUIComputedDataInterface,
    NavLinkUIComponentsInterface,
} from "../ui_types/nav_link_ui_type";

class NavLinkUIActionHandler {

    private controller: BaseController<
        NavLinkUIPropsInterface,
        NavLinkUIStateDataInterface,
        NavLinkUIComputedDataInterface,
        NavLinkUIComponentsInterface
    >;

    constructor(
        controller: BaseController<
            NavLinkUIPropsInterface,
            NavLinkUIStateDataInterface,
            NavLinkUIComputedDataInterface,
            NavLinkUIComponentsInterface
        >
    ) {
        this.controller = controller;
    }

    public handleOnClick = async (event: MouseEvent): Promise<void> =>  {

        const { props } = this.controller;

        await props.action_props?.on_click?.(
            event,
            { props }
        );

        return;

    }

}

export default NavLinkUIActionHandler;
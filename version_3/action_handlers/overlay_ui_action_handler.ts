
import BaseController from "../base_classes/base_controller";

import { 
    OverlayUIPropsInterface,
    OverlayUIStateDataInterface,
    OverlayUIComputedDataInterface,
    OverlayUIComponentsInterface,
} from "../ui_types/overlay_ui_type";

class OverlayUIActionHandler {

    private controller: BaseController<
        OverlayUIPropsInterface,
        OverlayUIStateDataInterface,
        OverlayUIComputedDataInterface,
        OverlayUIComponentsInterface
    >;

    constructor(
        controller: BaseController<
            OverlayUIPropsInterface,
            OverlayUIStateDataInterface,
            OverlayUIComputedDataInterface,
            OverlayUIComponentsInterface
        >
    ) {
        this.controller = controller;
    }

    public async handleOpen() {

        const { props } = this.controller;

        this.controller.state_refs.is_open.value = true;

        if (props.boolean_props?.lock_scroll) {
            document.body.style.overflow = "hidden";
        }

        await props.action_props?.on_open?.({
            props
        });

    }


    public async handleClose() {

        const { props } = this.controller;

        this.controller.state_refs.is_open.value = false;

        document.body.style.overflow = "";

        await props.action_props?.on_close?.({
            props
        });

    }


    public async handleOverlayClick(event: MouseEvent) {

        const { props } = this.controller;

        await props.action_props?.on_overlay_click?.(
            event,
            { props }
        );

        if (props.boolean_props?.close_on_overlay_click) {

            await this.handleClose();

        }

    }

}

export default OverlayUIActionHandler;

import BaseActionHandler from "../base_classes/base_action_handler";
import BaseController from "../base_classes/base_controller";

import {
    OverlayUIComponentsInterface,
    OverlayUIComputedDataInterface,
    OverlayUIPropsInterface,
    OverlayUIStateDataInterface
} from "../ui_types/overlay_ui_type";

class OverlayUIActionHandler extends BaseActionHandler<
    OverlayUIPropsInterface,
    OverlayUIStateDataInterface,
    OverlayUIComputedDataInterface,
    OverlayUIComponentsInterface
> {
    constructor(
        controller: BaseController<
            OverlayUIPropsInterface,
            OverlayUIStateDataInterface,
            OverlayUIComputedDataInterface,
            OverlayUIComponentsInterface
        >
    ) {
        super(controller);
    }

    public syncBodyScrollLock = (is_open: boolean): void => {
        if (!this.props.boolean_props?.lock_scroll) {
            return;
        }

        document.body.style.overflow = is_open ? "hidden" : "";
    };

    public handleOpen = async (): Promise<void> => {
        this.setState("is_open", true);
        this.syncBodyScrollLock(true);

        const { on_open } = this.props.action_props || {};

        await this.invokeAction(on_open, { props: this.props });
    };

    public handleClose = async (): Promise<void> => {
        this.setState("is_open", false);
        this.syncBodyScrollLock(false);

        const { on_close } = this.props.action_props || {};

        await this.invokeAction(on_close, { props: this.props });
    };

    public handleOverlayClick = async (event: MouseEvent): Promise<void> => {
        const { on_overlay_click } = this.props.action_props || {};

        await this.invokeAction(on_overlay_click, event, { props: this.props });

        if (this.props.boolean_props?.close_on_overlay_click) {
            await this.handleClose();
        }
    };
}

export default OverlayUIActionHandler;

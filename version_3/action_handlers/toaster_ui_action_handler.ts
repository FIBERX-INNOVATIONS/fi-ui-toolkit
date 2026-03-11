import BaseController from "../base_classes/base_controller";

import {
    ToasterUIPropsInterface,
    ToasterUIStateDataInterface,
    ToasterUIComputedDataInterface
} from "../ui_types/toaster_ui_type";

class ToasterUIActionHandler {

    private controller: BaseController<
        ToasterUIPropsInterface,
        ToasterUIStateDataInterface,
        ToasterUIComputedDataInterface
    >;

    private timeout_id: ReturnType<typeof setTimeout> | null = null;

    constructor(
        controller: BaseController<
            ToasterUIPropsInterface,
            ToasterUIStateDataInterface,
            ToasterUIComputedDataInterface
        >
    ) {
        this.controller = controller;

        this.initAutoClose();
    }

    /* ------------------------------ */
    private clearTimer() {

        if (this.timeout_id) {
            clearTimeout(this.timeout_id);
            this.timeout_id = null;
        }

    }

    /* ------------------------------ */
    private initAutoClose() {

        this.clearTimer();

        const duration = this.controller.props.duration ?? 0;

        if (!duration) return;

        this.timeout_id = setTimeout(() => {

            this.controller.state_refs.visible.value = false;

        }, duration);

    }

    /* ------------------------------ */
    public restartAutoClose() {

        this.initAutoClose();

    }

    /* ------------------------------ */
    public handleOnClick = (event?: MouseEvent) => {

        this.clearTimer();

        this.controller.state_refs.visible.value = false;

        const props         = this.controller.props
        const state_refs    = this.controller.state_refs;
        const visible       = state_refs.visible.value;
        const { on_click }   = props.action_props || {};

        if(!on_click) { return }

        on_click?.(event, visible, { props });

    };

     /* ------------------------------ */
    public handleOnHide = (event?: MouseEvent) => {
        const props         = this.controller.props
        const state_refs    = this.controller.state_refs;
        const visible       = state_refs.visible.value;
        const { on_hide }   = props.action_props || {};
        

        if(!on_hide) { return }

        on_hide?.(event, visible, { props });
    };

}

export default ToasterUIActionHandler;
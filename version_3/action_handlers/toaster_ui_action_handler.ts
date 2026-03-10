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

    private initAutoClose() {

        const duration = this.controller.props.duration || 0;

        if (!duration) return;

        setTimeout(() => {

            this.controller.state_refs.visible.value = false;

        }, duration);

    }

    public handleOnClick = (event: MouseEvent) => {

        this.controller.state_refs.visible.value = false;

    };

}

export default ToasterUIActionHandler;
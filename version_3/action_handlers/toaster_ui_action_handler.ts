import BaseActionHandler from "../base_classes/base_action_handler";
import BaseController from "../base_classes/base_controller";

import {
    ToasterUIComponentsInterface,
    ToasterUIComputedDataInterface,
    ToasterUIPropsInterface,
    ToasterUIStateDataInterface
} from "../ui_types/toaster_ui_type";

class ToasterUIActionHandler extends BaseActionHandler<
    ToasterUIPropsInterface,
    ToasterUIStateDataInterface,
    ToasterUIComputedDataInterface,
    ToasterUIComponentsInterface
> {
    private timeout_id: ReturnType<typeof setTimeout> | null = null;

    constructor(
        controller: BaseController<
            ToasterUIPropsInterface,
            ToasterUIStateDataInterface,
            ToasterUIComputedDataInterface,
            ToasterUIComponentsInterface
        >
    ) {
        super(controller);
        this.initAutoClose();
    }

    private clearTimer(): void {
        if (this.timeout_id) {
            clearTimeout(this.timeout_id);
            this.timeout_id = null;
        }
    }

    private initAutoClose(): void {
        this.clearTimer();

        const duration = this.props.duration ?? 0;

        if (!duration || !this.state_refs.visible?.value) return;

        this.timeout_id = setTimeout(() => {
            this.setState("visible", false);
        }, duration);
    }

    public restartAutoClose(): void {
        this.initAutoClose();
    }

    public handleOnClick = async (event?: MouseEvent): Promise<void> => {
        this.clearTimer();
        this.setState("visible", false);

        const { on_click } = this.props.action_props || {};

        await this.invokeAction(on_click, event, this.state_refs.visible.value, { props: this.props });
    };

    public handleOnHide = async (event?: MouseEvent): Promise<void> => {
        const { on_hide } = this.props.action_props || {};

        await this.invokeAction(on_hide, event, this.state_refs.visible.value, { props: this.props });
    };
}

export default ToasterUIActionHandler;

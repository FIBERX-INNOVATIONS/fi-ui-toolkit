import BaseController from "../base_classes/base_controller";

import OverlayUIActionHandler from "../action_handlers/overlay_ui_action_handler";

import { ComputedDefinitionType, WatchersType } from "../types/base_type";

import {
    OverlayUIPropsInterface,
    OverlayUIStateDataInterface,
    OverlayUIComputedDataInterface,
    OverlayUIComponentsInterface
} from "../ui_types/overlay_ui_type";

class OverlayUIController extends BaseController<
    OverlayUIPropsInterface,
    OverlayUIStateDataInterface,
    OverlayUIComputedDataInterface,
    OverlayUIComponentsInterface
> {
    public override action_handler: OverlayUIActionHandler;

    private readonly blocked_wrapper_classes: string[] = ["opacity-0", "hidden", "invisible", "pointer-events-none"];

    constructor(props: OverlayUIPropsInterface) {
        super("overlay_ui", props);

        this.action_handler = new OverlayUIActionHandler(this);
        this.setActionHandler(this.action_handler);

        this.getComponentDefinition();
    }

    protected getUIComponents(): OverlayUIComponentsInterface {
        return {};
    }

    protected getUIStateData(): OverlayUIStateDataInterface {
        return {
            is_open: this.props.model_value ?? false
        };
    }

    protected getUIComputedData(): ComputedDefinitionType<OverlayUIComputedDataInterface> {
        return {
            show_overlay: () => {
                return this.state_refs.is_open.value;
            },

            wrapper_class_style: () => {
                const class_style = this.props.class_styles?.wrapper_class_style ?? "";

                if (!this.state_refs.is_open.value) {
                    return class_style;
                }

                return class_style
                    .split(" ")
                    .filter((class_name) => !this.blocked_wrapper_classes.includes(class_name))
                    .join(" ");
            }
        };
    }

    protected getUIWatchers(): WatchersType<OverlayUIPropsInterface, OverlayUIStateDataInterface> {
        return {
            model_value: (new_val) => {
                const is_open = new_val ?? false;

                this.state_refs.is_open.value = is_open;
                this.action_handler.syncBodyScrollLock(is_open);
            }
        };
    }

    protected async handleBeforeUnmountedLogic(): Promise<void> {
        this.action_handler.syncBodyScrollLock(false);
    }
}

export default OverlayUIController;

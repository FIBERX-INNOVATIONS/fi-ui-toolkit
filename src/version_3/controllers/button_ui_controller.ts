import BaseController from "../base_classes/base_controller";

import ButtonUIActionHandler from "../action_handlers/button_ui_action_handler";

import { ComputedDefinitionType, WatchersType } from "../types/base_type";

import {
    ButtonUIPropsInterface,
    ButtonUIStateDataInterface,
    ButtonUIComputedDataInterface,
    ButtonUIComponentsInterface
} from "../ui_types/button_ui_type";

class ButtonUIController extends BaseController<
    ButtonUIPropsInterface,
    ButtonUIStateDataInterface,
    ButtonUIComputedDataInterface,
    ButtonUIComponentsInterface
> {
    public override action_handler: ButtonUIActionHandler;

    constructor(props: ButtonUIPropsInterface) {
        super("button_ui", props);

        this.action_handler = new ButtonUIActionHandler(this);
        this.setActionHandler(this.action_handler);

        this.getComponentDefinition();
    }

    protected getUIComponents(): ButtonUIComponentsInterface {
        return {};
    }

    protected getUIStateData(): ButtonUIStateDataInterface {
        return {
            is_loading: false,

            error_text: null
        };
    }

    protected getUIComputedData(): ComputedDefinitionType<ButtonUIComputedDataInterface> {
        return {
            is_disabled: (): boolean => {
                return this.props.boolean_props?.disabled || this.state_refs.is_loading.value;
            },

            button_class: (): string => {
                const { class_styles } = this.props;

                const base_classes = [class_styles?.button_class_style || ""];

                if (this.state_refs.is_loading.value) {
                    base_classes.push(class_styles?.loading_class_style || "");
                }

                if (this.props.boolean_props?.disabled || this.state_refs.is_loading.value) {
                    base_classes.push(class_styles?.disabled_class_style || "");
                }

                return base_classes.filter(Boolean).join(" ");
            }
        };
    }

    protected getUIWatchers(): WatchersType<ButtonUIPropsInterface, ButtonUIStateDataInterface> {
        return {
            boolean_props: {
                handler: () => {
                    this.state_refs.error_text.value = null;
                },
                options: { deep: true }
            }
        };
    }
}

export default ButtonUIController;

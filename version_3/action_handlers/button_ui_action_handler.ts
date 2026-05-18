import BaseActionHandler from "../base_classes/base_action_handler";
import BaseController from "../base_classes/base_controller";

import {
    ButtonUIComponentsInterface,
    ButtonUIComputedDataInterface,
    ButtonUIPropsInterface,
    ButtonUIStateDataInterface
} from "../ui_types/button_ui_type";

class ButtonUIActionHandler extends BaseActionHandler<
    ButtonUIPropsInterface,
    ButtonUIStateDataInterface,
    ButtonUIComputedDataInterface,
    ButtonUIComponentsInterface
> {
    constructor(
        controller: BaseController<
            ButtonUIPropsInterface,
            ButtonUIStateDataInterface,
            ButtonUIComputedDataInterface,
            ButtonUIComponentsInterface
        >
    ) {
        super(controller);
    }

    public handleOnClick = async (event: MouseEvent): Promise<void> => {
        await this.runWithLoading(
            "is_loading",
            async () => {
                const { on_click } = this.props.action_props || {};

                const result = await this.invokeAction(on_click, event, { props: this.props });
                this.setErrorFromResult(result);
            },
            { prevent_when_loading: true }
        );
    };

    public handleOnHover = async (event: MouseEvent): Promise<void> => {
        const { on_hover } = this.props.action_props || {};

        const result = await this.invokeAction(on_hover, event, { props: this.props });
        this.setErrorFromResult(result);
    };
}

export default ButtonUIActionHandler;

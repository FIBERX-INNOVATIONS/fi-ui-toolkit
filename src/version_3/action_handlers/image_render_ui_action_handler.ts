import BaseActionHandler from "../base_classes/base_action_handler";
import BaseController from "../base_classes/base_controller";

import {
    ImageRenderUIComponentsInterface,
    ImageRenderUIComputedDataInterface,
    ImageRenderUIPropsInterface,
    ImageRenderUIStateDataInterface
} from "../ui_types/image_render_ui_type";

class ImageRenderUIActionHandler extends BaseActionHandler<
    ImageRenderUIPropsInterface,
    ImageRenderUIStateDataInterface,
    ImageRenderUIComputedDataInterface,
    ImageRenderUIComponentsInterface
> {
    constructor(
        controller: BaseController<
            ImageRenderUIPropsInterface,
            ImageRenderUIStateDataInterface,
            ImageRenderUIComputedDataInterface,
            ImageRenderUIComponentsInterface
        >
    ) {
        super(controller);
    }

    public handleOnClick = async (event: MouseEvent): Promise<void> => {
        const { on_click } = this.props.action_props || {};

        await this.invokeAction(on_click, event, { props: this.props });
    };

    public handleOnLoad = (): void => {
        this.setState("is_loading", false);
    };

    public handleOnError = (): void => {
        this.setState("is_loading", false);
        this.setState("has_error", true);
    };
}

export default ImageRenderUIActionHandler;

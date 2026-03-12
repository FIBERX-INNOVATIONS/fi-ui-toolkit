import BaseController from "../base_classes/base_controller";

import { 
    ImageRenderUIPropsInterface,
    ImageRenderUIStateDataInterface,
    ImageRenderUIComputedDataInterface,
    ImageRenderUIComponentsInterface,
} from "../ui_types/image_render_ui_type";

class ImageRenderUIActionHandler {

    private controller: BaseController<
        ImageRenderUIPropsInterface,
        ImageRenderUIStateDataInterface,
        ImageRenderUIComputedDataInterface,
        ImageRenderUIComponentsInterface
    >;

    constructor(
        controller: BaseController<
            ImageRenderUIPropsInterface,
            ImageRenderUIStateDataInterface,
            ImageRenderUIComputedDataInterface,
            ImageRenderUIComponentsInterface
        >
    ) {

        this.controller = controller;

    }

    public handleOnClick = async (event: MouseEvent):Promise<void> =>  {

        const { props } = this.controller;

        await props.action_props?.on_click?.(
            event,
            { props }
        );
        return;

    }

    public handleOnLoad = () => {

        this.controller.state_refs.is_loading.value = false;

    }

    public handleOnError = () => {

        this.controller.state_refs.is_loading.value = false;

        this.controller.state_refs.has_error.value = true;

    }

}

export default ImageRenderUIActionHandler;
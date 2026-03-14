
import BaseController  from "../base_classes/base_controller";

import ImageRenderUIActionHandler from "../action_handlers/image_render_ui_action_handler";

import { ComputedDefinitionType } from "../types/base_type";


import { 
    ImageRenderUIPropsInterface,
    ImageRenderUIStateDataInterface,
    ImageRenderUIComputedDataInterface,
    ImageRenderUIComponentsInterface,
} from "../ui_types/image_render_ui_type";

class ImageRenderUIController extends BaseController<
    ImageRenderUIPropsInterface,
    ImageRenderUIStateDataInterface,
    ImageRenderUIComputedDataInterface,
    ImageRenderUIComponentsInterface
>{

    public action_handler: ImageRenderUIActionHandler =
        new ImageRenderUIActionHandler(this);

    constructor(props: ImageRenderUIPropsInterface) {

        super("image_render_ui", props);

        this.getComponentDefinition();

    }

    protected getUIComponents(): ImageRenderUIComponentsInterface {

        return {
            ImgComponent: Image
        };

    }

    protected getUIStateData(): ImageRenderUIStateDataInterface {

        return {

            is_loading: true,

            has_error: false

        };

    }

    protected getUIComputedData(): ComputedDefinitionType<ImageRenderUIComputedDataInterface> {

        return {

            show_image: () => {

                return !this.state_refs.has_error.value;

            }

        };

    }

}

export default ImageRenderUIController;


import BaseController  from "../base_classes/base_controller";

import { ScreenLoaderUIPropsInterface } from "../ui_types/screen_loader_ui_type";

class ScreenLoaderUIController extends BaseController<
    ScreenLoaderUIPropsInterface
> {
    constructor(props: ScreenLoaderUIPropsInterface) {
        super("screen_loader_ui", props);

        this.getComponentDefinition();
    }

}

export default ScreenLoaderUIController;
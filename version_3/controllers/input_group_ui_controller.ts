import BaseController from "../base_classes/base_controller";

import {
    InputGroupUIPropsInterface
} from "../ui_types/input_group_ui_type";

class InputGroupUIController extends BaseController<
    InputGroupUIPropsInterface
> {

    constructor(props: InputGroupUIPropsInterface) {

        super("input_group_ui", props);

        this.getComponentDefinition();

    }

}

export default InputGroupUIController;
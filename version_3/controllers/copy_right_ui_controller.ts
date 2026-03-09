

import BaseController  from "../base_classes/base_controller";

import { CopyRightUIPropsInterface } from "../ui_types/copy_rigth_ui_type";

class CopyRightUIController extends BaseController<
    CopyRightUIPropsInterface
> {
    
    constructor(props: CopyRightUIPropsInterface) {
        super("copy_rigth_ui", props);

        this.getComponentDefinition();
    }

}

export default CopyRightUIController;
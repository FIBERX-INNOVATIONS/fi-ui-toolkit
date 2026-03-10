

import BaseController  from "../base_classes/base_controller";

import { HeaderTextUIPropsInterface } from "../ui_types/header_text_ui_type";

class HeaderTextUIController extends BaseController<
    HeaderTextUIPropsInterface
> {
    
    constructor(props: HeaderTextUIPropsInterface) {
        super("copy_rigth_ui", props);

        this.getComponentDefinition();
    }

}

export default HeaderTextUIController;
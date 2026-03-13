

import BaseController  from "../base_classes/base_controller";

import { ComputedDefinitionType } from "../types/base_type";

import { 
    LayoutSectionsUIPropsInterface,
    LayoutSectionsUIStateDataInterface,
    LayoutSectionsUIComputedDataInterface,
    LayoutSectionsUIComponentsInterface,
} from "../ui_types/layout_sections_ui_type";

class LayoutSectionsUIController extends BaseController<
    LayoutSectionsUIPropsInterface,
    LayoutSectionsUIStateDataInterface,
    LayoutSectionsUIComputedDataInterface,
    LayoutSectionsUIComponentsInterface
>{

    constructor(props: LayoutSectionsUIPropsInterface) {

        super("layout_sections_ui", props);

        this.getComponentDefinition();

    }

    protected getUIComponents(): LayoutSectionsUIComponentsInterface {

        return {};

    }

    protected getUIStateData(): LayoutSectionsUIStateDataInterface {

        return {

            initialized: true

        };

    }

    protected getUIComputedData(): ComputedDefinitionType<LayoutSectionsUIComputedDataInterface> {

        return {

            component_type: () => {

                return this.props.element_type ?? "nav";

            }

        };

    }

}

export default LayoutSectionsUIController;
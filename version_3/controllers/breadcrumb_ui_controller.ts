
import BaseController  from "../base_classes/base_controller";

import { ComputedDefinitionType } from "../types/base_type";

import { 
    BreadcrumbUIPropsInterface,
    BreadcrumbUIStateDataInterface,
    BreadcrumbUIComputedDataInterface,
    BreadcrumbUIComponentsInterface,
} from "../ui_types/breadcrumb_ui_type";

import NavLinkUI from "../components/NavLinkUI.vue";


class BreadcrumbUIController extends BaseController<
    BreadcrumbUIPropsInterface,
    BreadcrumbUIStateDataInterface,
    BreadcrumbUIComputedDataInterface,
    BreadcrumbUIComponentsInterface
>{

    constructor(props: BreadcrumbUIPropsInterface) {

        super("breadcrumb_ui", props);

        this.getComponentDefinition();

    }

    protected getUIComponents(): BreadcrumbUIComponentsInterface {

        return {
            NavLinkUI
        };

    }

    protected getUIStateData(): BreadcrumbUIStateDataInterface {

        return {
            initialized: true
        };

    }

    protected getUIComputedData(): ComputedDefinitionType<BreadcrumbUIComputedDataInterface> {

        return {

            has_items: () => {

                return (
                    Array.isArray(this.props.breadcrumb_items) &&
                    this.props.breadcrumb_items.length > 0
                );

            }

        };

    }

}

export default BreadcrumbUIController;
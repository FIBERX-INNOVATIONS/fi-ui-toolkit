import BaseController  from "../base_classes/base_controller";

import { ComputedDefinitionType } from "../types/base_type";

import { 
    PageHeaderUIPropsInterface,
    PageHeaderUIStateDataInterface,
    PageHeaderUIComputedDataInterface,
    PageHeaderUIComponentsInterface,
} from "../ui_types/page_header_ui_type";

import HeaderTextUI from "../components/HeaderTextUI.vue";
import ButtonUI from "../components/ButtonUI.vue";

class PageHeaderUIController extends BaseController<
    PageHeaderUIPropsInterface,
    PageHeaderUIStateDataInterface,
    PageHeaderUIComputedDataInterface,
    PageHeaderUIComponentsInterface
>{

    constructor(props: PageHeaderUIPropsInterface) {

        super("page_header_ui", props);

        this.getComponentDefinition();

    }

    protected getUIComponents(): PageHeaderUIComponentsInterface {

        return {

            HeaderTextUI,
            ButtonUI

        };

    }

    protected getUIStateData(): PageHeaderUIStateDataInterface {

        return {

            initialized: true

        };

    }

    protected getUIComputedData(): ComputedDefinitionType<PageHeaderUIComputedDataInterface> {

        return {

            has_actions: () => {

                return Array.isArray(this.props.action_buttons) &&
                    this.props.action_buttons.length > 0;

            },

            has_description: () => {

                return !!this.props.description_text;

            }

        };

    }

}

export default PageHeaderUIController;

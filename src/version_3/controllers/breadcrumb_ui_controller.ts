import BaseController from "../base_classes/base_controller";

import { ComputedDefinitionType, WatchersType } from "../types/base_type";

import {
    BreadcrumbUIPropsInterface,
    BreadcrumbUIStateDataInterface,
    BreadcrumbUIComputedDataInterface,
    BreadcrumbUIComponentsInterface
} from "../ui_types/breadcrumb_ui_type";

import NavLinkUI from "../components/NavLinkUI.vue";

class BreadcrumbUIController extends BaseController<
    BreadcrumbUIPropsInterface,
    BreadcrumbUIStateDataInterface,
    BreadcrumbUIComputedDataInterface,
    BreadcrumbUIComponentsInterface
> {
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
            items_count: Array.isArray(this.props.breadcrumb_items) ? this.props.breadcrumb_items.length : 0
        };
    }

    protected getUIComputedData(): ComputedDefinitionType<BreadcrumbUIComputedDataInterface> {
        return {
            has_items: () => {
                return Array.isArray(this.props.breadcrumb_items) && this.props.breadcrumb_items.length > 0;
            },

            display_items: () => {
                return Array.isArray(this.props.breadcrumb_items) ? this.props.breadcrumb_items : [];
            }
        };
    }

    protected getUIWatchers(): WatchersType<BreadcrumbUIPropsInterface, BreadcrumbUIStateDataInterface> {
        return {
            breadcrumb_items: {
                handler: (new_items) => {
                    const items_count = Array.isArray(new_items) ? new_items.length : 0;
                    this.state_refs.items_count.value = items_count;
                },
                options: { deep: true }
            }
        };
    }
}

export default BreadcrumbUIController;

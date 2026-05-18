import PaginationUIActionHandler from "../action_handlers/pagination_ui_action_handler";
import BaseController from "../base_classes/base_controller";

import { ComputedDefinitionType } from "../types/base_type";

import {
    PaginationUIPropsInterface,
    PaginationUIStateDataInterface,
    PaginationUIComputedDataInterface,
    PaginationUIComponentsInterface
} from "../ui_types/pagination_ui_type";

class PaginationUIController extends BaseController<
    PaginationUIPropsInterface,
    PaginationUIStateDataInterface,
    PaginationUIComputedDataInterface,
    PaginationUIComponentsInterface
> {
    public override action_handler: PaginationUIActionHandler;

    constructor(props: PaginationUIPropsInterface) {
        super("pagination_ui", props);

        this.action_handler = new PaginationUIActionHandler(this);
        this.setActionHandler(this.action_handler);

        this.getComponentDefinition();
    }

    protected getUIComponents(): PaginationUIComponentsInterface {
        return {};
    }

    protected getUIStateData(): PaginationUIStateDataInterface {
        return {};
    }

    protected getUIComputedData(): ComputedDefinitionType<PaginationUIComputedDataInterface> {
        return {
            current_page: () => {
                return Math.max(1, this.props.data_props.current_page ?? 1);
            },

            total_pages: () => {
                return Math.max(1, this.props.data_props.total_pages ?? 1);
            },

            is_prev_disabled: () => this.computed_refs.current_page.value <= 1,

            is_next_disabled: () => this.computed_refs.current_page.value >= this.computed_refs.total_pages.value,

            pages: () => {
                const current_page = this.computed_refs.current_page.value;
                const total_pages = this.computed_refs.total_pages.value;
                const max = this.props.config_props?.max_visible_pages ?? 5;

                if (total_pages <= max) {
                    return Array.from({ length: total_pages }, (_, i) => i + 1);
                }

                const pages: (number | string)[] = [];

                const start = Math.max(1, Math.min(current_page - Math.floor(max / 2), total_pages - max + 1));
                const end = Math.min(total_pages, start + max - 1);

                if (start > 1) {
                    pages.push(1);
                    if (start > 2) pages.push("...");
                }

                for (let i = start; i <= end; i++) {
                    pages.push(i);
                }

                if (end < total_pages) {
                    if (end < total_pages - 1) pages.push("...");
                    pages.push(total_pages);
                }

                return pages;
            }
        };
    }
}

export default PaginationUIController;

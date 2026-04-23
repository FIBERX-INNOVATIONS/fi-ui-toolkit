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
    public action_handler: PaginationUIActionHandler = new PaginationUIActionHandler(this);
    
    constructor(props: PaginationUIPropsInterface) {
        super("pagination_ui", props);
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

            is_prev_disabled: () =>
                this.props.data_props.current_page <= 1,

            is_next_disabled: () =>
                this.props.data_props.current_page >= this.props.data_props.total_pages,

            pages: () => {

                const { current_page, total_pages } = this.props.data_props;
                const max = this.props.config_props?.max_visible_pages ?? 5;

                if (total_pages <= max) {
                    return Array.from({ length: total_pages }, (_, i) => i + 1);
                }

                const pages: (number | string)[] = [];

                const start = Math.max(1, current_page - Math.floor(max / 2));
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
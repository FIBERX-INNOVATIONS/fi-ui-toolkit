import BaseActionHandler from "../base_classes/base_action_handler";
import BaseController from "../base_classes/base_controller";

import {
    PaginationUIComponentsInterface,
    PaginationUIComputedDataInterface,
    PaginationUIPropsInterface,
    PaginationUIStateDataInterface
} from "../ui_types/pagination_ui_type";

class PaginationUIActionHandler extends BaseActionHandler<
    PaginationUIPropsInterface,
    PaginationUIStateDataInterface,
    PaginationUIComputedDataInterface,
    PaginationUIComponentsInterface
> {
    constructor(
        controller: BaseController<
            PaginationUIPropsInterface,
            PaginationUIStateDataInterface,
            PaginationUIComputedDataInterface,
            PaginationUIComponentsInterface
        >
    ) {
        super(controller);
    }

    public handlePageChange = async (page: number): Promise<void> => {
        const total_pages = Math.max(1, this.props.data_props.total_pages ?? 1);
        const current_page = Math.max(1, this.props.data_props.current_page ?? 1);
        const next_page = Math.min(Math.max(page, 1), total_pages);

        if (next_page === current_page) {
            return;
        }

        const { on_page_change } = this.props.action_props || {};

        await this.invokeAction(on_page_change, next_page);
    };
}

export default PaginationUIActionHandler;

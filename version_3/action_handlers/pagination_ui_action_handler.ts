import BaseController from "../base_classes/base_controller";

import {
    PaginationUIPropsInterface,
    PaginationUIStateDataInterface,
    PaginationUIComputedDataInterface,
    PaginationUIComponentsInterface
} from "../ui_types/pagination_ui_type";

class PaginationUIActionHandler {

    constructor(
        private controller: BaseController<
            PaginationUIPropsInterface,
            PaginationUIStateDataInterface,
            PaginationUIComputedDataInterface,
            PaginationUIComponentsInterface
        >
    ) {}

    public handlePageChange = async (page: number): Promise<void> => {

        const { on_page_change } = this.controller.props.action_props || {};

        if (!on_page_change) return;

        await on_page_change(page);

    };

}

export default PaginationUIActionHandler;
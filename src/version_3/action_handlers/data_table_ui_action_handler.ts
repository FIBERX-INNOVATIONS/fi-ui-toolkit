import BaseActionHandler from "../base_classes/base_action_handler";
import BaseController from "../base_classes/base_controller";

import ContentManagerUtil from "../utils/content_manager_util";

import {
    DataTableCellRenderReturnType,
    DataTableColumnRenderType,
    DataTableUIComponentsInterface,
    DataTableUIComputedDataInterface,
    DataTableUIPropsInterface,
    DataTableUIStateDataInterface
} from "../ui_types/data_table_ui_type";

class DataTableUIActionHandler<T extends Record<string, any> = Record<string, any>> extends BaseActionHandler<
    DataTableUIPropsInterface<T>,
    DataTableUIStateDataInterface<T>,
    DataTableUIComputedDataInterface<T>,
    DataTableUIComponentsInterface
> {
    constructor(
        controller: BaseController<
            DataTableUIPropsInterface<T>,
            DataTableUIStateDataInterface<T>,
            DataTableUIComputedDataInterface<T>,
            DataTableUIComponentsInterface
        >
    ) {
        super(controller);
    }

    public handleSortDataByCol = async (key: keyof T): Promise<void> => {
        await this.runWithLoading("loading", async () => {
            const { sort_key, sort_direction } = this.state_refs;

            if (sort_key.value !== key) {
                sort_key.value = key;
                sort_direction.value = "asc";
            } else if (sort_direction.value === "asc") {
                sort_direction.value = "desc";
            } else if (sort_direction.value === "desc") {
                sort_direction.value = null;
                sort_key.value = null;
            } else {
                sort_direction.value = "asc";
            }

            const { on_sort } = this.props.action_props || {};

            await this.invokeAction(on_sort, key, sort_direction.value, { props: this.props });
        });
    };

    public getHeaderContent(col: DataTableColumnRenderType<T>): DataTableCellRenderReturnType {
        if (col.header?.render) {
            return col.header.render(col);
        }

        if (col.header?.label_key) {
            const cm = ContentManagerUtil.getInstance();
            return cm?.get<string>(col.header.label_key) ?? null;
        }

        return null;
    }

    public getCellContent(col: DataTableColumnRenderType<T>, row: T, index: number): DataTableCellRenderReturnType {
        if (col.cell?.render) {
            return col.cell.render(row, index);
        }

        if (col.cell?.content_key) {
            const cm = ContentManagerUtil.getInstance();
            return cm?.get<string>(col.cell.content_key) ?? null;
        }

        return (row?.[col.key] as DataTableCellRenderReturnType) ?? null;
    }
}

export default DataTableUIActionHandler;

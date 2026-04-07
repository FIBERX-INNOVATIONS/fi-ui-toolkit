

import BaseController from "../base_classes/base_controller";

import ContentManagerUtil from "../utils/content_manager_util";

import { 
    DataTableUIPropsInterface,
    DataTableUIStateDataInterface,
    DataTableUIComputedDataInterface,
    DataTableUIComponentsInterface,
    DataTableColumnRenderType,
    DataTableCellRenderReturnType,
} from "../ui_types/data_table_ui_type";

class DataTableUIActionHandler<T = any> {

    private controller: BaseController<
        DataTableUIPropsInterface<T>,
        DataTableUIStateDataInterface,
        DataTableUIComputedDataInterface<T>,
        DataTableUIComponentsInterface
    >;

    constructor(
        controller: BaseController<
            DataTableUIPropsInterface<T>,
            DataTableUIStateDataInterface,
            DataTableUIComputedDataInterface<T>,
            DataTableUIComponentsInterface
        >
    ) {
        this.controller = controller;
    }

    /* SORT HANDLER */
    public handleSortDataByCol = async (key: keyof T): Promise<void> => {
        this.controller.state_refs.loading.value = true;

        try {
            const { state_refs, props } = this.controller;

            const { sort_key, sort_direction, loading } = state_refs;

            if (sort_key.value !== key) {
                sort_key.value = key;
                sort_direction.value = "asc";
            } 
            else {
                if (sort_direction.value === "asc") {
                    sort_direction.value = "desc";
                } else if (sort_direction.value === "desc") {
                    sort_direction.value = null;
                    sort_key.value = null;
                } else {
                    sort_direction.value = "asc";
                }
            }

            await props.action_props?.on_sort?.(
                key,
                sort_direction.value,
                { props }
            );
        }
        catch(error: unknown) {

        }
        finally {
            this.controller.state_refs.loading.value = false;
        }
    }

    /* HEADER RENDER */
    public getHeaderContent(col: DataTableColumnRenderType<T>) {

        if (col.header?.render) {
            return col.header.render(col);
        }

        if (col.header?.label_key) {
            const cm = ContentManagerUtil.getInstance();
            return cm?.get<string | null>?.(col.header?.label_key) ?? null;
        }

    }

    /* CELL RENDER (🔥 CORE) */
    public getCellContent(
        col: DataTableColumnRenderType<T>,
        row: T,
        index: number
    ): DataTableCellRenderReturnType | null {

        if (col.cell?.render) {
            return col.cell.render(row, index);
        }

        if (col.cell?.content_key) {
            const cm = ContentManagerUtil.getInstance();
            return cm?.get<string | null>?.(col.cell.content_key, "") ?? null;
        }

        return row?.[col.key] ?? null;
    }
}

export default DataTableUIActionHandler;
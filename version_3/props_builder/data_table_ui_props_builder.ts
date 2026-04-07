import { reactive } from "vue";

import { 
    DataTableColumnRenderType, 
    DataTableUIActionPropsInterface, 
    DataTableUIBuilderConfig, 
    DataTableUIClassStylesInterface, 
    DataTableUIContentPropsInterface, 
    DataTableUIPropsInterface 
} from "../ui_types/data_table_ui_type";

import DataTableUIClassStyles from "../class_styles/data_table_ui_class_styles";
import ContentManagerUtil from "../utils/content_manager_util";

class DataTableUIPropsBuilder {

    /* ---------------------------------- */
    /* Global Config                      */
    /* ---------------------------------- */

    public static default_section_id: string = "DataTableSection";

    public static default_table_id: string = "DataTable";

    public static defualt_class_styles: DataTableUIClassStylesInterface = DataTableUIClassStyles;

    public static default_action_props?: DataTableUIActionPropsInterface;


    public static default_content_props?: DataTableUIContentPropsInterface;

    /* ---------------------------------- */
    /* Setup Method                       */
    /* ---------------------------------- */

    public static configure(config: DataTableUIBuilderConfig): void {
        const {
            section_id,
            table_id,
            class_styles,
            action_props,
            loader_html_content_key,
            loader_html_content,
            empty_data_html_content_key,
            empty_data_html_content
        } = config;

        const cm = ContentManagerUtil.getInstance();

        const loader_content = loader_html_content ??
            (loader_html_content_key
                ? cm.get<string>(loader_html_content_key, "")
                : "") ??
            "";

        const empty_content = empty_data_html_content ??
            (empty_data_html_content_key
                ? cm.get<string>(empty_data_html_content_key, "")
                : "") ??
            "";

        DataTableUIPropsBuilder.default_section_id =
            section_id ?? "DataTableSection";

        DataTableUIPropsBuilder.default_table_id =
            table_id ?? "DataTable";

        DataTableUIPropsBuilder.defualt_class_styles =
            class_styles || DataTableUIClassStyles;

        DataTableUIPropsBuilder.default_action_props =
            action_props;

        DataTableUIPropsBuilder.default_content_props = {
            loader_html_content: loader_content,
            empty_data_html_content: empty_content
        }
            
    }

    /* ---------------------------------- */
    /* Build Props                        */
    /* ---------------------------------- */

    private static buildPropsObject<T>(
        row_key: keyof T,
        table_render_obj: DataTableColumnRenderType<T>[],
        data: T[],
        overrides?: Partial<DataTableUIPropsInterface>
    ): DataTableUIPropsInterface {
        return {
            section_id: overrides?.section_id ?? DataTableUIPropsBuilder.default_section_id,
            table_id: overrides?.table_id ?? DataTableUIPropsBuilder.default_table_id,
            class_styles: {
                ...DataTableUIPropsBuilder.defualt_class_styles,
                ...overrides?.class_styles,
            },
            action_props: {
                ...DataTableUIPropsBuilder.default_action_props,
                ...overrides?.action_props
            },
            content: {
                ...DataTableUIPropsBuilder.default_content_props,
                ...overrides?.content
            },
            row_key: row_key ?? undefined,
            table_render_obj,
            data
        }

    }

    /* ---------------------------------- */
    /* Public Builder                     */
    /* ---------------------------------- */

    public static getReactivePropsObject<T>(
        row_key: keyof T,
        table_render_obj: DataTableColumnRenderType<T>[],
        data: T[],
        overrides?: Partial<DataTableUIPropsInterface>
    ): DataTableUIPropsInterface {
        const props_obj = DataTableUIPropsBuilder.buildPropsObject(
            row_key,
            table_render_obj,
            data,
            overrides
        );

        return reactive(props_obj);
    }


}

export default DataTableUIPropsBuilder;
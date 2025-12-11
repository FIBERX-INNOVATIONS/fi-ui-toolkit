import { reactive, warn }                   from "vue";
import InputTransformerUtil                 from "../utils/input_formatter_util";
import RenderHtmlUtil                       from "../utils/render_html_util";

import { 
    ActivityListUIClassStylesInterface,
    ActivityListUIRenderMethodsinterface,
    ActivityListUIPropsInterface 
} from "../types/props_builder_type" 



class ActivityListUIPropsBuilder {
    public static readonly name = "activity_list_ui_props_builder";

    /** Default getRecordId */
    public static getRecordId = (record: Record<string, any>): string | number => { return record?.id ?? JSON.stringify(record); };

    /** Default header section 1: shows index (1-based) */
    public static defaultRenderHeaderSection1 = ( index: number ): string => { return String(index + 1); };

    /** Default header section 2: shows formatted created_at timestamp */
    public static defaultRenderHeaderSection2 = (_index: number, record: Record<string, any> ): string => {
        return InputTransformerUtil.formatReadableDateTime(record?.created_at ?? "");
    };

    /** Default body renderer: returns description or empty string */
    public static defaultRenderBodyContent = (_index: number, record: Record<string, any>): string => {
        return record?.description ?? "";
    };

    // Method to get toast alert ui props
    public static getActivityListProps (
        activity_records: Record<string, any>[],
        selected_records: (string | number)[],
        class_styles: ActivityListUIClassStylesInterface = {},
        render_methods: ActivityListUIRenderMethodsinterface = {},
        force_select_mode: boolean = false,
        loader_content?: string | null
    ): ActivityListUIPropsInterface {
        const select_mode = force_select_mode ? true : selected_records && Array.isArray(selected_records) && selected_records.length ? true : false;

        const loader_content_text = loader_content ?? RenderHtmlUtil.renderLoaderHtml({});


        const {
            getRecordId = ActivityListUIPropsBuilder.getRecordId,
            onSelect,
            renderHeaderSection1Content = ActivityListUIPropsBuilder.defaultRenderHeaderSection1,
            renderHeaderSection2Content = ActivityListUIPropsBuilder.defaultRenderHeaderSection2,
            renderBodyContent = ActivityListUIPropsBuilder.defaultRenderBodyContent
        } = render_methods;

        const {
            wrapper_class_style = "",
            activity_wrapper_class_style = "",
            activity_header_class_style = "",
            activity_header_section_1_class_style = "",
            activity_header_section_2_class_style = "",
            activity_body_class_style = "",
            activity_body_content_class_style = "",
            select_checkbox_wrapper_class_style = "",
            select_checkbox_class_style = ""
        } = class_styles
        

        return reactive<ActivityListUIPropsInterface>({
            select_mode,
            selected_records,
            activity_records,
            loader_content_text,
            getRecordId,
            onSelect,
            renderHeaderSection1Content,
            renderHeaderSection2Content,
            renderBodyContent,
            wrapper_class_style,
            activity_wrapper_class_style,
            activity_header_class_style,
            activity_header_section_1_class_style,
            activity_header_section_2_class_style,
            activity_body_class_style,
            activity_body_content_class_style,
            select_checkbox_wrapper_class_style,
            select_checkbox_class_style,
        })

    }

}

export default ActivityListUIPropsBuilder;

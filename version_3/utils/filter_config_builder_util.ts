import InputUIPropsBuilder from "../props_builder/input_ui_props_builder";
import InputGroupUIPropsBuilder from "../props_builder/input_group_ui_props_builder";

import { ListFilterConfig } from "../types/filter_config_type";
import { FilterFieldConfigInterface } from "../ui_types/filters_panel_ui_type";
import { InputGroupUIClassStylesInterface } from "../ui_types/input_group_ui_type";
import { InputType, InputUIClassStylesInterface, InputUIPropsInterface, SelectOptionInterface } from "../ui_types/input_ui_type";
import ContentManagerUtil from "./content_manager_util";

class FilterConfigBuilderUtil {

    public static build(
        filters: ListFilterConfig[],
        class_styles?: { 
            input_group_class_style: InputGroupUIClassStylesInterface;

            input_ui_class_style: InputUIClassStylesInterface;
        }
    ): FilterFieldConfigInterface[] {
        const content_manager = ContentManagerUtil.getInstance();

        return filters.map((filter) => {

            const input_type: InputType = filter.type ?? "text";

            let options: SelectOptionInterface[] | undefined = undefined;

            if(filter.options_content_key) {
                const content_options = content_manager.get<SelectOptionInterface>(filter.options_content_key) ?? [];
                options = (content_options) as SelectOptionInterface[]
            }
            else if (filter?.options?.length) {
                options = filter.options;
            }

            const input_overide = filter.overides;

            const input_props = InputUIPropsBuilder.getReactivePropsObject(
                filter.key,
                input_type,
                filter.input_content_key,
                {
                    ...input_overide,
                    option_props: options,
                    class_styles: class_styles?.input_ui_class_style,

                }
            );      

            const input_group_props = InputGroupUIPropsBuilder.getReactivePropsObject(
                input_props,
                filter.label_content_key,
                class_styles?.input_group_class_style
            );

            return {
                key: filter.key,
                input_group_props: input_group_props
            };

        });

    }

}

export default FilterConfigBuilderUtil;
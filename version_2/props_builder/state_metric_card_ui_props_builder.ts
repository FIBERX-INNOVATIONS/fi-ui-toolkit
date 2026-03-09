import { reactive } from "vue";
import { 
    StatRecordinterface,
    StatMetricCardUIClassstyles,
    StatMetricCardUIPropsInterface
} from "../types/props_builder_type" 



class StatMetricCardUIPropsBuilder {
    public static readonly name = "stat_metric_card_ui_props_builder";


    // Method to get toast alert ui props
    public static getCardMetricPropsFromStatRecord (
        stat_record: StatRecordinterface,
        class_styles: StatMetricCardUIClassstyles = {}
    ): StatMetricCardUIPropsInterface {
        const { 
            label_text, metric_value, metric_suffix, 
            metric_value_2, metric_suffix_2, link_text, link
        } = stat_record

        const {
            wrapper_class_style,
            top_section_class_style,
            middle_section_class_style,
            metric_value_class_style,
            metric_suffix_class_style,
            bottom_section_class_style,
            metic_one_wrapper_class_style,
            metic_two_wrapper_class_style,
        } = class_styles

        const renderTopContent      = () => { return `${label_text}` };
        const renderBottomContent   = () => { return `<a href="${link}" class="underline">${link_text}</a>` };
    

        return reactive<StatMetricCardUIPropsInterface>({
            metric_value, 
            metric_suffix, 
            metric_value_2, 
            metric_suffix_2, 
            renderTopContent,
            renderBottomContent,
            wrapper_class_style,
            top_section_class_style,
            middle_section_class_style,
            metric_value_class_style,
            metric_suffix_class_style,
            bottom_section_class_style,
            metic_one_wrapper_class_style,
            metic_two_wrapper_class_style,
        })

    }

}

export default StatMetricCardUIPropsBuilder;

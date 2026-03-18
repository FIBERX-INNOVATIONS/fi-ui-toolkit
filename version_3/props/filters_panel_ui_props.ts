import { PropType } from "vue";

import FiltersPanelUIClassStyles from "../class_styles/filters_panel_ui_class_styles";

import {
    FiltersPanelUIClassStylesInterface,
    FiltersPanelUIActionPropsInterface,
    FilterFieldConfigInterface,
    FiltersPanelUIPropsInterface
} from "../ui_types/filters_panel_ui_type";

import { ButtonUIPropsInterface } from "../ui_types/button_ui_type";


const FiltersPanelUIProps = {

    id: {
        type: String,
        default: ""
    },

    toggle_btn_content: {
        type: String,
        default: ""
    },

    filter_fields: {
        type: Array as PropType<FilterFieldConfigInterface[]>,
        default: () => []
    },

    apply_button: {
        type: Object as PropType<ButtonUIPropsInterface>,
        default: () => ({})
    },

    clear_button: {
        type: Object as PropType<ButtonUIPropsInterface>,
        default: () => ({})
    },

    sync_route_query: {
        type: Boolean,
        default: true
    },

    action_props: {
        type: Object as PropType<FiltersPanelUIActionPropsInterface>,
        default: () => ({})
    },

    class_styles: {
        type: Object as PropType<FiltersPanelUIClassStylesInterface>,
        default: () => FiltersPanelUIClassStyles
    }

} satisfies Record<keyof FiltersPanelUIPropsInterface, any>;

export default FiltersPanelUIProps;
import { PropType } from "vue";

import {
    PaginationUIPropsInterface,
    PaginationLayoutType,
    PaginationUIContentPropsInterface,
    PaginationUIDataPropsInterface,
    PaginationUIConfigPropsInterface,
    PaginationUIActionPropsInterface,
    PaginationUIClassStylesInterface
} from "../ui_types/pagination_ui_type";

import PaginationUIClassStyles from "../class_styles/pagination_ui_class_styles";

const PaginationUIProps = {

    id: { type: String },

    layout: {
        type: String as PropType<PaginationLayoutType>,
        default: "center"
    },

    content_props: {
        type: Object as PropType<PaginationUIContentPropsInterface>,
        default: () => ({})
    },

    data_props: {
        type: Object as PropType<PaginationUIDataPropsInterface>,
        default: () => ({}),
        required: true
    },

    config_props: {
        type: Object as PropType<PaginationUIConfigPropsInterface>,
        default: () => ({
            show_numbers: true,
            max_visible_pages: 5
        })
    },

    action_props: {
        type: Object as PropType<PaginationUIActionPropsInterface>,
        default: () => ({})
    },

    class_styles: {
        type: Object as PropType<PaginationUIClassStylesInterface>,
        default: () => PaginationUIClassStyles
    }

} satisfies Record<keyof PaginationUIPropsInterface, any>;

export default PaginationUIProps;
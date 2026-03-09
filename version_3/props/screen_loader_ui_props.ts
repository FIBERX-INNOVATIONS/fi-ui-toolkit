
import { PropType } from "vue";

import ScreenLoaderUIClassStyles from "../class_styles/screen_loader_ui_class_styles";

import {
    LoaderSymbolInterface,
    ScreenLoaderClassStylesInterface,
    ScreenLoaderUIPropsInterface
} from "../ui_types/screen_loader_ui_type";



const ScreenLoaderUIProps = {

    visible: {
        type: Boolean,
        default: false
    },

    class_styles: {
        type: Object as PropType<ScreenLoaderClassStylesInterface>,
        default: () => ScreenLoaderUIClassStyles
    },

    loader_symbol: {
        type: Object as PropType<LoaderSymbolInterface>,
        default: () => ({})
    },

    loader_text: {
        type: String,
        default: "Loading..."
    }

} satisfies Record<keyof ScreenLoaderUIPropsInterface, any>;

export default ScreenLoaderUIProps;
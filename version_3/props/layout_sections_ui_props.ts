import { PropType } from "vue";

import LayoutSectionsUIClassStyles from "../class_styles/layout_sections_ui_class_styles";

import {
    LayoutSectionsElementType,
    LayoutSectionsUIClassStylesInterface,
    LayoutSectionsUIPropsInterface
} from "../ui_types/layout_sections_ui_type";


const LayoutSectionsUIProps = {

    id: {
        type: String,
        required: true
    },

    element_type: {
        type: String as PropType<LayoutSectionsElementType>,
        default: "nav"
    },

    class_styles: {
        type: Object as PropType<LayoutSectionsUIClassStylesInterface>,
        default: () => LayoutSectionsUIClassStyles
    }

} satisfies Record<keyof LayoutSectionsUIPropsInterface, any>;

export default LayoutSectionsUIProps;
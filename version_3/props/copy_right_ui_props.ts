
import { PropType } from "vue";

import CopyRightUIClassstyles from "../class_styles/copy_right_ui_class_styles";

import {
    CopyRightUIPropsInterface,
    CopyRightUIClassStylesInterface
} from "../ui_types/copy_rigth_ui_type";

const current_year = new Date().getFullYear().toString();

const CopyRightUIProps = {
    year_text: { 
        type: String, 
        default: current_year, 
        required: false 
    },

    powered_by_text: { 
        type: String, 
        required: true 
    },

    author_text: { 
        type: String, 
        required: true 
    },

    class_styles: {
        type: Object as PropType<CopyRightUIClassStylesInterface>,
        default: () => CopyRightUIClassstyles
    },


} satisfies Record<keyof CopyRightUIPropsInterface, any>;

export default CopyRightUIProps;
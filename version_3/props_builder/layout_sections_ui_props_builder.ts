import { reactive } from "vue";

import LayoutSectionsUIClassStyles from "../class_styles/layout_sections_ui_class_styles";

import {
    LayoutSectionsUIPropsInterface,
    LayoutSectionsUIClassStylesInterface,
    LayoutSectionsElementType
} from "../ui_types/layout_sections_ui_type";


class LayoutSectionsUIPropsBuilder {

    public static class_styles?: LayoutSectionsUIClassStylesInterface;


    public static configure(

        class_styles?: LayoutSectionsUIClassStylesInterface

    ): void {

        LayoutSectionsUIPropsBuilder.class_styles =
            class_styles || LayoutSectionsUIClassStyles;

    }


    private static buildPropsObject(

        id: string,

        element_type: LayoutSectionsElementType = "nav",

        overrides: Partial<LayoutSectionsUIPropsInterface> = {}

    ): LayoutSectionsUIPropsInterface {

        return {

            id,

            element_type,

            class_styles:
                overrides.class_styles ??
                LayoutSectionsUIPropsBuilder.class_styles ??
                LayoutSectionsUIClassStyles

        };

    }


    public static getReactivePropsObject(

        id: string,

        element_type: LayoutSectionsElementType = "nav",

        overrides: Partial<LayoutSectionsUIPropsInterface> = {}

    ): LayoutSectionsUIPropsInterface {

        const props =
            LayoutSectionsUIPropsBuilder.buildPropsObject(
                id,
                element_type,
                overrides
            );

        return reactive<LayoutSectionsUIPropsInterface>(props);

    }

}

export default LayoutSectionsUIPropsBuilder;
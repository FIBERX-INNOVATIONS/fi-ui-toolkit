import { reactive } from "vue";

import DropdownMenuUIClassStyles from "../class_styles/dropdown_menu_ui_class_styles";

import {
    DropdownMenuUIPropsInterface,
    DropdownMenuUIClassStylesInterface
} from "../ui_types/dropdown_menu_ui_type";


class DropdownMenuUIPropsBuilder {

    public static class_styles?: DropdownMenuUIClassStylesInterface;


    public static configure(
        class_styles?: DropdownMenuUIClassStylesInterface
    ): void {

        DropdownMenuUIPropsBuilder.class_styles =
            class_styles || DropdownMenuUIClassStyles;

    }


    private static buildPropsObject(

        id: string,

        overrides: Partial<DropdownMenuUIPropsInterface> = {}

    ): DropdownMenuUIPropsInterface {

        return {

            id,

            menu_items: overrides.menu_items ?? [],

            class_styles:
                overrides.class_styles ??
                DropdownMenuUIPropsBuilder.class_styles ??
                DropdownMenuUIClassStyles

        };

    }


    public static getReactivePropsObject(

        id: string,

        overrides: Partial<DropdownMenuUIPropsInterface> = {}

    ): DropdownMenuUIPropsInterface {

        const props =
            DropdownMenuUIPropsBuilder.buildPropsObject(
                id,
                overrides
            );

        return reactive<DropdownMenuUIPropsInterface>(props);

    }


    /* ---------------------------------- */
    /* Smart Dropdown Toggle              */
    /* ---------------------------------- */

    public static toggleDropdownMenu(

        trigger_id: string,

        menu_id: string

    ): void {

        const trigger =
            document.getElementById(trigger_id);

        const menu =
            document.getElementById(menu_id);

        if (!trigger || !menu) return;

        const rect = trigger.getBoundingClientRect();

        const viewport_width = window.innerWidth;
        const viewport_height = window.innerHeight;

        const menu_width = menu.offsetWidth || 200;
        const menu_height = menu.offsetHeight || 200;

        let top = rect.bottom;
        let left = rect.left;

        if (rect.bottom + menu_height > viewport_height) {
            top = rect.top - menu_height;
        }

        if (rect.left + menu_width > viewport_width) {
            left = rect.right - menu_width;
        }

        menu.style.top = `${top}px`;
        menu.style.left = `${left}px`;

        menu.style.display =
            menu.style.display === "block"
                ? "none"
                : "block";

    }

}

export default DropdownMenuUIPropsBuilder;
import { reactive } from "vue";

import DropdownMenuUIClassStyles from "../class_styles/dropdown_menu_ui_class_styles";

import {
    DropdownMenuUIPropsInterface,
    DropdownMenuUIClassStylesInterface,
    ContentMenuPayloadInterface
} from "../ui_types/dropdown_menu_ui_type";

import { NavLinkUIClassStylesInterface, NavLinkUIPropsInterface } from "../ui_types/nav_link_ui_type";

import ContentManagerUtil from "../utils/content_manager_util";
import NavLinkUIPropsBuilder from "./nav_link_ui_props_builder";
import { SVGIconKey } from "../resources/svg_icon_resource";

class DropdownMenuUIPropsBuilder {
    public static class_styles?: DropdownMenuUIClassStylesInterface;

    public static readonly content_manager: ContentManagerUtil = ContentManagerUtil.getInstance();

    private static activeScrollHandler: ((e: Event) => void) | null = null;

    private static activeClickHandler: ((e: MouseEvent) => void) | null = null;

    public static configure(class_styles?: DropdownMenuUIClassStylesInterface): void {
        DropdownMenuUIPropsBuilder.class_styles = class_styles || DropdownMenuUIClassStyles;
    }

    private static buildPropsObject(
        id: string,

        overrides: Partial<DropdownMenuUIPropsInterface> = {}
    ): DropdownMenuUIPropsInterface {
        return {
            id,

            menu_items: overrides.menu_items ?? [],

            class_styles: overrides.class_styles ?? DropdownMenuUIPropsBuilder.class_styles ?? DropdownMenuUIClassStyles
        };
    }

    public static getReactivePropsObject(
        id: string,

        overrides: Partial<DropdownMenuUIPropsInterface> = {}
    ): DropdownMenuUIPropsInterface {
        const props = DropdownMenuUIPropsBuilder.buildPropsObject(id, overrides);

        return reactive<DropdownMenuUIPropsInterface>(props);
    }

    public static buildMenuList(
        content_key: string,
        class_styles: NavLinkUIClassStylesInterface
    ): NavLinkUIPropsInterface[] {
        if (!content_key) {
            return [];
        }

        const content_payload =
            DropdownMenuUIPropsBuilder.content_manager.get<ContentMenuPayloadInterface[]>(content_key);

        if (!content_payload || !content_payload.length) {
            return [];
        }

        const nav_links = [];

        for (const payload of content_payload) {
            const { menu_text, menu_link, menu_icon, menu_id_text = "", menu_img_link } = payload;

            const nav_link_item = NavLinkUIPropsBuilder.getReactivePropsObject(menu_id_text, menu_link, {
                icon: menu_icon as SVGIconKey,
                img_src: menu_img_link,
                img_alt_text: menu_text,
                content: menu_text,
                class_styles
            });

            nav_links.push(nav_link_item);
        }

        return nav_links;
    }

    /* ---------------------------------- */
    /* Smart Dropdown Toggle              */
    /* ---------------------------------- */

    public static toggleDropdownMenu(
        trigger_id: string,
        menu_id: string,
        close_on_outside_click: boolean = true,
        close_on_scroll: boolean = true
    ): void {
        const trigger = document.getElementById(trigger_id);
        const menu = document.getElementById(menu_id);

        if (!trigger || !menu) return;

        const is_open = menu.style.display === "block";

        // ✅ ALWAYS CLEAN OLD LISTENERS FIRST
        if (this.activeClickHandler) {
            document.removeEventListener("click", this.activeClickHandler);
            this.activeClickHandler = null;
        }

        if (this.activeScrollHandler) {
            document.removeEventListener("scroll", this.activeScrollHandler, true);
            this.activeScrollHandler = null;
        }

        // Toggle
        if (is_open) {
            menu.style.display = "none";
            menu.style.visibility = "hidden";
            return;
        }

        // OPEN MENU
        menu.style.display = "block";
        menu.style.visibility = "visible";

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

        // ✅ OUTSIDE CLICK
        if (close_on_outside_click) {
            this.activeClickHandler = (event: MouseEvent) => {
                const target = event.target as Node;

                if (!menu.contains(target) && !trigger.contains(target)) {
                    menu.style.display = "none";
                    menu.style.visibility = "hidden";

                    document.removeEventListener("click", this.activeClickHandler!);
                    this.activeClickHandler = null;
                }
            };

            setTimeout(() => {
                document.addEventListener("click", this.activeClickHandler!);
            }, 10);
        }

        // ✅ SCROLL CLOSE
        if (close_on_scroll) {
            this.activeScrollHandler = () => {
                menu.style.display = "none";
                menu.style.visibility = "hidden";

                document.removeEventListener("scroll", this.activeScrollHandler!, true);
                this.activeScrollHandler = null;
            };

            setTimeout(() => {
                document.addEventListener("scroll", this.activeScrollHandler!, true);
            }, 10);
        }

        // const rect = trigger.getBoundingClientRect();

        // const viewport_width = window.innerWidth;
        // const viewport_height = window.innerHeight;

        // menu.style.display = is_open ? "none" : "block";
        // menu.style.visibility = is_open ? "hidden" : "visible";

        // if (is_open) return;

        // const menu_width = menu.offsetWidth || 200;
        // const menu_height = menu.offsetHeight || 200;

        // let top = rect.bottom;
        // let left = rect.left;

        // if (rect.bottom + menu_height > viewport_height) {
        //     top = rect.top - menu_height;
        // }

        // if (rect.left + menu_width > viewport_width) {
        //     left = rect.right - menu_width;
        // }

        // menu.style.top = `${top}px`;
        // menu.style.left = `${left}px`;

        // if (close_on_outside_click) {

        //     const handleOutsideClick = (event: MouseEvent) => {
        //         const target = event.target as Node;

        //         if (
        //             !menu.contains(target) &&
        //             !trigger.contains(target)
        //         ) {
        //             menu.style.display = "none";
        //             menu.style.visibility = "hidden";

        //             document.removeEventListener("click", handleOutsideClick);
        //         }
        //     };

        //     setTimeout(() => {
        //         document.addEventListener("click", handleOutsideClick);
        //     }, 10);
        // }

        // if (close_on_scroll) {
        //     const handleCloseOnScroll = (event: Event) => {
        //         menu.style.display = "none";
        //         menu.style.visibility = "hidden";

        //         document.removeEventListener("scroll", handleCloseOnScroll);
        //     }

        //     setTimeout(() => {
        //         document.addEventListener("scroll", handleCloseOnScroll, true); // 👈 important: true
        //     }, 10);
        // }
    }
}

export default DropdownMenuUIPropsBuilder;

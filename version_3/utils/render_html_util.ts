import { SVGIconKey, SVGIcons } from "../resources/svg_icon_resource";

import {
    RenderHtmlOptionsInterface,
    LoadingHtmlOptions,
    TitleAndSubTitleHTMLInterface
} from "../types/util_type";


class RenderHtmlUtil {

    /* ---------------------------------- */
    /* Private Helpers                    */
    /* ---------------------------------- */

    private static buildIconHtml(
        icon_key?: SVGIconKey,
        icon_class?: string
    ): string {

        if (!icon_key) { return "" };

        return `<span class="${icon_class}">${SVGIcons?.[icon_key]}</span>`;
    }


    private static combineContent(
        text: string = "",
        icon_html: string,
        order: "icon-first" | "text-first"
    ): string {

        return order === "icon-first"
            ? `${icon_html}${text}`
            : `${text}${icon_html}`;

    }


    /* ---------------------------------- */
    /* Generic HTML Renderer              */
    /* ---------------------------------- */

    public static renderHtml({
        text,
        icon,
        element = "span",
        order = "icon-first",
        icon_class_style = "w-8 h-8 flex items-center mr-2",
        class_style = "flex items-center",
        href = "#"
    }: RenderHtmlOptionsInterface): string {

        const icon_html = this.buildIconHtml(icon, icon_class_style);

        const content = this.combineContent(text, icon_html, order);

        if (element === "a") {

            return `
<a
    href="${href}"
    target="_blank"
    rel="noopener noreferrer"
    class="${class_style}"
>
    ${content}
</a>`.trim();

        }

        return `
<${element} class="${class_style}">
    ${content}
</${element}>`.trim();

    }


    /* ---------------------------------- */
    /* Loader Renderer                    */
    /* ---------------------------------- */

    public static renderLoaderHtml(params: LoadingHtmlOptions = {
        icon_name: "loading_svg_icon",
        class_style: "w-4 h-4 ml-2 flex items-center"
    }): string {
        const icon_name = params?.icon_name || "loading_svg_icon";
        const class_style = params?.class_style || "w-4 h-4 ml-2 flex items-center"

        const icon = SVGIcons?.[(icon_name as SVGIconKey)] ?? "";

        return `<span class="${class_style}">${icon}</span>`;

    }


    /* ---------------------------------- */
    /* Title + Subtitle Renderer          */
    /* ---------------------------------- */

    public static renderTitleAndSubtitleHTML({
        title_text = "",
        sub_title_text = "",
        wrapper_class_style = "",
        title_class_style = "",
        sub_title_class_style = ""
    }: TitleAndSubTitleHTMLInterface): string {

        return `
<div class="${wrapper_class_style}">
    <strong class="${title_class_style}">
        ${title_text}
    </strong>
    <span class="${sub_title_class_style}">
        ${sub_title_text}
    </span>
</div>`.trim();

    }

}

export default RenderHtmlUtil;
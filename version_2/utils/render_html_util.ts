
import SVGIcons from "../../version_3/resources/svg_icon_resource";

import { 
    RenderHtmlOptionsInterface,
    LoadingHtmlOptions,
    TitleAndSubTitleHTMLInterface
} from "../../version_3/types/util_type";

class RenderHtmlUtil {

    public static renderHtml({ 
        text = "", 
        icon = "", 
        element = "span", 
        order = "icon-first", 
        icon_class_style = "w-8 h-8 flex items-center mr-2",
        class_style = "flex items-center", 
        href = "#"
    }: RenderHtmlOptionsInterface): string {
        const icon_html = icon 
            ? `<span class="${icon_class_style}">${icon}</span>`
            : "";

        if (element === "a") {
            return `
            <a href="${href}" target="_blank" rel="noopener noreferrer"  class="${class_style || ""}">
                ${order === "icon-first" ? `${icon_html}${text}` : `${text}${icon_html}`}
            </a>`;
        }

        return `
        <${element} class="${class_style || ""}">
            ${order === "icon-first" ? `${icon_html}${text}` : `${text}${icon_html}`}
        </${element}>`;
    }

    public static renderLoaderHtml ({
        icon_name = "loading_svg_icon",
        class_style = "w-4 h-4 ml-2 flex items-center"
    }: LoadingHtmlOptions): string {
        return `<span class="${class_style}">${SVGIcons[icon_name]}</span>`
    }

    public static renderTitleAndSubtitleHTML ({
        title_text = "",
        sub_title_text = "",
        wrapper_class_style = "",
        title_class_style = "",
        sub_title_class_style = ""
    }: TitleAndSubTitleHTMLInterface): string {
        return `
            <div class="${wrapper_class_style}">
                <strong class="${title_class_style}">${title_text}</strong>
                <span class="${sub_title_class_style}">${sub_title_text}</strong>
            </div>
        `
    }

}

export default RenderHtmlUtil; 
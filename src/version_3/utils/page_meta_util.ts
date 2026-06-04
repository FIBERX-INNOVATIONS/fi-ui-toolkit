import type { RouteLocationNormalizedLoaded, RouteMeta, Router } from "vue-router";

import ContentManagerUtil from "./content_manager_util";
import LoggerUtil from "./logger_util";

type MetaValueType = string | null | undefined;

export interface PageMetaUtilConfigInterface {
    app_name?: string;
    default_title?: string;
    default_description?: string;
    title_template?: string;
    content_root_key?: string;
    title_suffix_separator?: string;
    update_open_graph?: boolean;
    update_twitter?: boolean;
}

interface RoutePageMetaInterface extends RouteMeta {
    page_meta_key?: MetaValueType;
    meta_key?: MetaValueType;
    title_key?: MetaValueType;
    description_key?: MetaValueType;
    title_content_key?: MetaValueType;
    description_content_key?: MetaValueType;
}

interface ResolvedPageMetaInterface {
    title: string;
    description: string;
}

class PageMetaUtil {
    public readonly name = "page_meta_util";

    private static readonly logger = new LoggerUtil({ prefix: "page_meta_util", show_timestamp: false });

    private static readonly content_manager = ContentManagerUtil.getInstance();

    private static readonly default_config: Required<PageMetaUtilConfigInterface> = {
        app_name: "",
        default_title: "",
        default_description: "",
        title_template: "%title%",
        content_root_key: "content_resource.page_meta",
        title_suffix_separator: " | ",
        update_open_graph: true,
        update_twitter: true
    };

    public static install(router: Router, config: PageMetaUtilConfigInterface = {}): void {
        const resolved_config = PageMetaUtil.resolveConfig(config);

        router.afterEach((to) => {
            PageMetaUtil.applyRouteMeta(to, resolved_config);
        });

        if (router.currentRoute.value?.name) {
            PageMetaUtil.applyRouteMeta(router.currentRoute.value, resolved_config);
        }
    }

    public static applyRouteMeta(
        route: RouteLocationNormalizedLoaded,
        config: PageMetaUtilConfigInterface = {}
    ): ResolvedPageMetaInterface {
        const resolved_config = PageMetaUtil.resolveConfig(config);
        const route_meta = route.meta as RoutePageMetaInterface;

        const page_meta_key = PageMetaUtil.firstString(
            route_meta.page_meta_key,
            route_meta.meta_key,
            route_meta.title_key
        );

        const title_key = PageMetaUtil.resolveContentKey(
            route_meta.title_content_key,
            route_meta.title_key,
            page_meta_key,
            "title",
            resolved_config
        );

        const description_key = PageMetaUtil.resolveContentKey(
            route_meta.description_content_key,
            route_meta.description_key,
            page_meta_key,
            "description",
            resolved_config
        );

        const fallback_title = PageMetaUtil.resolveFallbackTitle(route, resolved_config);
        const fallback_description = resolved_config.default_description;

        const title = PageMetaUtil.getContentString(title_key, fallback_title);
        const description = PageMetaUtil.getContentString(description_key, fallback_description);
        const formatted_title = PageMetaUtil.formatTitle(title, resolved_config);

        PageMetaUtil.setDocumentTitle(formatted_title);
        PageMetaUtil.setMetaContent("description", description);

        if (resolved_config.update_open_graph) {
            PageMetaUtil.setMetaContent("og:title", formatted_title, "property");
            PageMetaUtil.setMetaContent("og:description", description, "property");
        }

        if (resolved_config.update_twitter) {
            PageMetaUtil.setMetaContent("twitter:title", formatted_title);
            PageMetaUtil.setMetaContent("twitter:description", description);
        }

        return {
            title: formatted_title,
            description
        };
    }

    private static resolveConfig(config: PageMetaUtilConfigInterface): Required<PageMetaUtilConfigInterface> {
        return {
            ...PageMetaUtil.default_config,
            ...config
        };
    }

    private static resolveContentKey(
        explicit_key: MetaValueType,
        direct_key: MetaValueType,
        page_meta_key: MetaValueType,
        field_key: "title" | "description",
        config: Required<PageMetaUtilConfigInterface>
    ): string | null {
        if (explicit_key) {
            return explicit_key;
        }

        if (direct_key?.includes(".")) {
            return direct_key;
        }

        if (page_meta_key) {
            return `${config.content_root_key}.${page_meta_key}.${field_key}`;
        }

        return null;
    }

    private static getContentString(content_key: string | null, fallback: string): string {
        if (!content_key) {
            return fallback;
        }

        const value = PageMetaUtil.content_manager.get<string>(content_key, fallback);

        if (typeof value !== "string") {
            PageMetaUtil.logger.warn(`Page metadata key "${content_key}" did not resolve to a string`);
            return fallback;
        }

        return value || fallback;
    }

    private static resolveFallbackTitle(
        route: RouteLocationNormalizedLoaded,
        config: Required<PageMetaUtilConfigInterface>
    ): string {
        const route_name = typeof route.name === "string" ? route.name : "";

        return config.default_title || PageMetaUtil.humanize(route_name) || config.app_name || document.title;
    }

    private static formatTitle(title: string, config: Required<PageMetaUtilConfigInterface>): string {
        if (config.title_template.includes("%title%")) {
            return config.title_template.replace("%title%", title).replace("%app%", config.app_name);
        }

        if (!config.app_name || title.includes(config.app_name)) {
            return title;
        }

        return `${title}${config.title_suffix_separator}${config.app_name}`;
    }

    private static setDocumentTitle(title: string): void {
        if (!title) {
            return;
        }

        document.title = title;
    }

    private static setMetaContent(name: string, content: string, attribute: "name" | "property" = "name"): void {
        if (!content) {
            return;
        }

        let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);

        if (!element) {
            element = document.createElement("meta");
            element.setAttribute(attribute, name);
            document.head.appendChild(element);
        }

        element.setAttribute("content", content);
    }

    private static firstString(...values: MetaValueType[]): string | null {
        return values.find((value): value is string => typeof value === "string" && value.length > 0) ?? null;
    }

    private static humanize(value: string): string {
        return value
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/[-_]/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .replace(/\b\w/g, (character) => character.toUpperCase());
    }
}

export default PageMetaUtil;

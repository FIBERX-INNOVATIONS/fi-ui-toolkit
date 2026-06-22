import { SVGIconKey } from "../resources/svg_icon_resource";

import axios, { AxiosResponse } from "axios";

import type { RouteMeta } from "vue-router";

export type SVGIconName = SVGIconKey;

export type LoggerType = "log" | "info" | "warn" | "error" | "debug";

export type ContentObjectType = Record<string, any>;

export interface CountLookupItemInterface {
    value: number;
    symbol: string;
}

export interface LoggerOptions {
    prefix?: string;
    show_timestamp?: boolean;
}

export interface EncryptedV2Interface {
    encrypted_data: string;
}

export interface CurrentMemberInterface {
    public_id: string;
    first_name: string;
    last_name: string;
    is_fully_authenticated: boolean;
    [key: string]: any;
}

export interface OtherMemberDataInterface {
    [key: string]: any;
}

export interface RenderHtmlOptionsInterface {
    element?: "span" | "strong" | "p" | "a";
    text?: string;
    icon?: SVGIconKey;
    order?: "icon-first" | "text-first";
    icon_class_style?: string;
    class_style?: string;
    href?: string;
}

export interface LoadingHtmlOptions {
    class_style?: string;
    icon_name?: SVGIconKey;
}

export interface APIResponseInterface<T = any> {
    status: string;
    msg: string;
    data?: T;
    full_response?: AxiosResponse;
}

export interface TitleAndSubTitleHTMLInterface {
    title_text?: string;
    sub_title_text?: string;
    wrapper_class_style?: string;
    title_class_style?: string;
    sub_title_class_style?: string;
}

export interface QRColor {
    r: number;
    g: number;
    b: number;
    a: number;
    hex: string;
}

export interface QRCodeOptions {
    width?: number; // Total width of QR image
    scale?: number; // Scale factor if width not provided
    margin?: number; // Margin around QR code
    color?: {
        dark?: QRColor; // Dark color for modules
        light?: QRColor; // Light/background color
    };
    type?: string; // MIME type e.g., 'image/png'
    rendererOpts?: Record<string, any>; // Additional renderer options
}

export type EncryptorConfigType = {
    corpus: string[];
    shift_key: number;
};

export type LocalStorageFieldType<T> = {
    encrypted_key: string;
    default_value?: T;
};

export type LocalStorageSchema = Record<string, LocalStorageFieldType<any>>;

export type StorageFieldType<T> = {
    encrypted_key: string;
    default_value?: T;
};

export type StorageSchemaType = Record<string, StorageFieldType<any>>;

export type MetaValueType = string | null | undefined;

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

export interface RoutePageMetaInterface extends RouteMeta {
    page_meta_key?: MetaValueType;
    meta_key?: MetaValueType;
    title_key?: MetaValueType;
    description_key?: MetaValueType;
    title_content_key?: MetaValueType;
    description_content_key?: MetaValueType;
}

export interface ResolvedPageMetaInterface {
    title_text: string;
    description_text: string;
}

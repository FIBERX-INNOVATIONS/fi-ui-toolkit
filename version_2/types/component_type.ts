import { Component }    from "vue";
import BaseEventHandler from "../base_classes/base_event_handler";
import BaseService      from "../base_classes/base_service";
import { SortDirectionType } from "./props_builder_type";

export type PropRenderFnType = (
    index: number,
    record: Record<string, any>,
    records: Record<string, any>[]
) => string | number | null;

export interface ComponentDefinitionInterface {
    props: Record<string, any>;
    components: Record<string, any>;
    state_refs: Record<string, any>;
    computed_refs: Record<string, any>;
}

export interface BaseControllerInterface {
    readonly name: string;
    component_name: string;

    props: Record<string, any>;
    components: Record<string, Component>;
    computed_refs: Record<string, any>;
    state_refs: Record<string, any>;
    event_handler?: BaseEventHandler;
    [key: string]: any;

    // Methods
    getComponentDefinition(): ComponentDefinitionInterface;
}

export interface ListControllerAttributesInterface {
    current_page?: number,
    total_pages?: number;
    total_items?: number;
    size?: number;
    order_by?: string;
    order_direction?: SortDirectionType;
    keyword?: string;
    records?: Record<string, any>[];
    selected_record? :Record<string, any>
    selected_records?: string[] | number [];
    app_id?: string;
}

export interface BaseEventHandlerInterface {
    name: string;
    component_name: string;
    [method: string]: any;
}


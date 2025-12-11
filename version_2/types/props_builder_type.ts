import { Component, PropType }      from "vue";
import { PropRenderFnType }         from "../types/component_type";

export type InputValueType = string | number | boolean | null | string[];

export type ButtonType = "button" | "submit" | "reset" | undefined;

export type SortDirectionType = "asc" | "desc" | "none";

export interface InputGroupClassStyleInterface {
    wrapper_class_style?: string;
    label_class_style?: string;
    label_required_class_style?: string;
    input_class_style?: string;
    same_row_wrapper_class_style?: string;
}

export interface SearchFieldClassStyleInterface {
    wrapper_class_style?: string;
    label_class_style?: string;
    label_required_class_style?: string;
    search_wrapper_class_style?: string;
    btn_wrapper_class_style?: string;
    input_wrapper_class_style?: string;
}

export interface LabelConfigInterface {
    label_text?: string,
    label_required_text?: string,
}

export interface InputUIBooleanPropsInterface {
    is_loading?: boolean;
            
    read_only?: boolean;

    required?: boolean;

    is_checked?: boolean;

    cache_enabled?: boolean;
}

export interface InputUIContentPropsInterface {
    switch_btn_id?: string;

    label_text?: string;

    loader_content?: string;

    caret_content?: string;

    no_options_content?: string;

    options?: Array<{ value: string | number; label_text: string }>;

    additional_parms?: Record<string, any>;

    checkbox_value?: InputValueType
}

export interface InputUINumberPropsInterface {
    length?: number;

    rows?: number;

    min?: number;

    max?: number;
}

export interface InputUIEventMethodsPropsInterface {
    on_change?: ((event: Event, value?: any) => void) | null;

    on_click?: ((event: MouseEvent, value?: any) => void) | null;

    on_key_up?: ((event: KeyboardEvent) => void) | null;

    on_key_down?: ((event: KeyboardEvent) => void) | null;

    render_option_label?: ((option: Record<string, any>) => string) | null;

    get_option_value?: ((option: Record<string, any>) => any) | null;

    fetch_method?: ((params: Record<string, any>) => Promise<any>) | null;
}

export interface InputUIClassStylesPropsInterface {
    input_class_style?: string;

    checkbox_input_class_style?: string;

    wrapper_class_style?: string;

    loader_class_style?: string;

    switch_btn_class_style?: string;

    label_text_class_style?: string;

    knob_class_style?: string;

    active_class_style?: string;

    inactive_class_style?: string;

    caret_icon_class?: string;

    dropdown_wrapper_class_style?: string;

    options_wrapper_class_style?: string;

    option_class_style?: string;
    
    option_content_class_style?: string;

    same_row_wrapper_class_style?: string;
}

export interface InputUIPropsInterface {
    id: string;

    switch_btn_id?: string;

    type?: string;

    placeholder?: string;

    label_text?: string;

    loader_content?: string;

    caret_content?: string;

    no_options_content?: string;

    is_loading?: boolean;
            
    read_only?: boolean;

    required?: boolean;

    is_checked?: boolean;

    cache_enabled?: boolean;

    value: InputValueType;

    checkbox_value?: InputValueType;

    /** Select/Dropdown options */
    options?: Array<{ value: string | number; label_text: string }>;

    length?: number;

    rows?: number;

    min?: number;

    max?: number;

    additional_parms?: Record<string, any>;

    on_change?: ((event: Event, value?: any) => void) | null;

    on_click?: ((event: MouseEvent, value?: any) => void) | null;

    on_key_up?: ((event: KeyboardEvent) => void) | null;

    on_key_down?: ((event: KeyboardEvent) => void) | null;

    render_option_label?: ((option: Record<string, any>) => string) | null;

    get_option_value?: ((option: Record<string, any>) => any) | null;

    fetch_method?: ((params: Record<string, any>) => Promise<any>) | null;
           
    input_class_style?: string;

    wrapper_class_style?: string;

    loader_class_style?: string;

    switch_btn_class_style?: string;

    label_text_class_style?: string;

    knob_class_style?: string;

    active_class_style?: string;

    inactive_class_style?: string;

    caret_icon_class?: string;

    dropdown_wrapper_class_style?: string;

    options_wrapper_class_style?: string;

    option_class_style?: string;
    
    option_content_class_style?: string;
}

export interface InputGroupPropsInterface {
    wrapper_class_style?: string;
    
    label_class_style?: string;

    label_required_class_style?: string;

    label_text?: string;

    label_required_text?: string;

    input_config: InputUIPropsInterface
}

export interface AlertBorderClassStyleInterface {
    success_border_class_style?: string;
    error_border_class_style?: string;
    info_border_class_style?: string;
    warning_border_class_style?: string;
}

export interface AlertStatusClassStyleInterface {
    success_class_style?: string;
    error_class_style?: string;
    info_class_style?: string;
    warning_class_style?: string;
}

export interface ToastAlertClassStyleInterface {
    wrapper_class_style?: string;
    icon_wrapper_class_style?: string,
    icon_class_style?: string,
    message_class_style?: string,
    border_class_styles?: AlertBorderClassStyleInterface,
    status_class_styles?: AlertStatusClassStyleInterface
}

export interface ToastAlertPropsInterface {
    wrapper_class_style?: string;
    icon_wrapper_class_style?: string;
    icon_class_style?: string;
    message_class_style?: string;
    status_icon: string;
    status: string;
    message?: string;
    on_close?: Function | null
}

export interface ButtonUIPropsInterface {
    type: ButtonType,

    id?: string,

    btn_class_style?: string,

    clicked?: boolean;
    
    show_loader?: boolean;

    disabled?: boolean;

    loader_content_text?: string,

    content_text?: string,

    on_click?: Function | null
}

export interface NavLinkUIPropsInterface {
    wrapper_class_style?: string;

    active_menu_class_style?: string;

    icon_img_wrapper_class_style?: string;

    icon_img_class_style?: string;

    content_class_style?: string;

    content?: string;

    id: string;

    link?: string | null;

    icon?: string | null;

    img_src?: string | null;

    img_alt_text?: string | null;

    on_click?: (event: MouseEvent) => void;

    is_active?: (id: string) => boolean;

    sub_menu_list?: NavLinkUIPropsInterface[];
}

export interface ImgAvatarUIPropsInterface {
    id: string;
    img_src?: string | null;
    img_alt_text?: string | null;
    initials?: string | null;
    right_slot_content?: string | null;
    wrapper_class_style?: string;
    avatar_circle_class_style?: string;
    img_class_style?: string;
    initials_class_style?: string;
    right_slot_class_style?: string;
    on_click?: (event: MouseEvent) => void | null;

}

export interface ImageTextUIPropsInterface {
    wrapper_class_style?: string;
    img_wrapper_class_style?: string;
    img_class_style?: string;
    text_class_style?: string;
    image_src?: string | null;
    img_alt_text?: string | null;
    text_content?: string | null;
}

export interface MenuListUIPropsInterface {
    id: string;
    parent_id?: string;
    wrapper_class_style?: string;
    list_class_style?: string;
    list_item_class_style?: string;
    menu_list?: NavLinkUIPropsInterface[];
}

export interface ModalSidebarUIPropsInterface {
    id: string;
    visible: boolean;
    wrapper_class_style?: string;
    sidebar_class_style?: string;
    section_1_wrapper_class_style?: string;
    section_2_wrapper_class_style?: string;
    on_click?: ((event?: MouseEvent) => void) | null;
}

export interface BreadCrumbUIPropsInterface {
    wrapper_class_style?: string;

    list_class_style?: string;

    list_item_class_style?: string;

    divider_class_style?: string;

    divider_content?: string;

    menu_list?: NavLinkUIPropsInterface[];
}

export interface BreadCrumgListInterface {
  menu_text: string;

  menu_svg_icon?: string;

  menu_link?: string | null;
}

export interface SearchFieldUIPropsInterface {
  wrapper_class_style?: string;
  label_class_style?: string;
  label_required_class_style?: string;
  search_wrapper_class_style?: string;
  btn_wrapper_class_style?: string;
  input_wrapper_class_style?: string;
  label_text?: string;
  label_required_text?: string;
  input_config: InputUIPropsInterface;
  btn_config: ButtonUIPropsInterface;
}

export interface SortableHeaderCellUIPropsInterface {
  label_content: string;
  field_key: string;
  sortable?: boolean;
  sort_direction?: SortDirectionType;
  wrapper_class_style?: string;
  content_wrapper_class_style?:string;
  icon_class_style?: string;
  on_sort?: (event:MouseEvent, direction: SortDirectionType) => void;
}

export interface TableColumnInterface extends Partial<SortableHeaderCellUIPropsInterface> {
    sortable?: boolean;
    content_type: "plain" | "formatted" | "component";
    field_key: string;
    col_class_style?: string;
    formatter?: <T>(value: any, record?: T) => string;
    component?: any;
    component_props?: (record: any) => Record<string, any>;
}

export interface TableHeaderUIPropsInterface {
    columns: TableColumnInterface[];
    sn_text?: string | null;
    actions_text?: string | null;
    wrapper_class_style?: string;
    header_row_class_style?: string;
    header_cell_class_style?: string;
    selected_checkbox_class_style?: string;
    all_selected?: boolean;
    some_selected?: boolean;
    on_toggle_all?: (event: Event | InputEvent, checked: boolean) => void;
}

export interface TableBodyUIPropsInterface {
    records: Record<string, any>[];
    columns: TableColumnInterface[];
    sn_text?: string | null;
    actions_text?: string | null;
    empty_text?: string;
    wrapper_class_style?: string;
    body_row_class_style?: string;
    body_cell_class_style?: string;
    selected_checkbox_class_style?: string;
    selected_records?: (string | number | Record<string, any>)[];
    record_id_key?: string;
    on_row_select?: (event: Event | InputEvent, record: Record<string, any>, checked: boolean) => void;
}

export interface DataTableUIPropsInterface {
    header_props: TableHeaderUIPropsInterface;
    body_props: TableBodyUIPropsInterface;
    table_class_style?: string;
}

export interface PaginationUIPropsInterface {
  wrapper_class_style?: string;
  prev_button_class_style?: string;
  next_button_class_style?: string;
  disabled_class_style?: string;
  select_class_style?: string;
  prev_btn_content?: string;
  next_btn_content?: string;
  render_page_content?: (page: number) => string | number | HTMLElement;
  total_pages?: number;
  current_page?: number;
  select_id?: string;
  show_loader: boolean;
  loader_content_text?: string,
  on_prev_clicked?: () => void;
  on_next_clicked?: () => void;
  on_new_page_clicked?: (page: number) => void;
}


export interface ModalUIPropsInterface {
  is_open: boolean;

  layer?: number;

  position?: string;

  width?: string;

  title_content?: string;

  close_btn_content?: string;

  loader_content_text?: string;

  body_component?: Component | null;

  body_props?: Record<string, any>;

  overlay_class_style?: string;

  modal_position_class_style?: string;

  modal_size_class_style?: string;

  modal_box_class_style?: string;

  header_wrapper_class_style?: string;

  header_title_content_class_style?: string;

  header_title_class_style?: string;

  header_close_btn_content_class_style?: string;

  close_btn_class_style?: string;

  body_class_style?: string;

  on_modal_close?: (event: MouseEvent, layer: number) => boolean;
}

export interface ActivityListUIClassStylesInterface {
    wrapper_class_style?: string;

    activity_wrapper_class_style?: string;

    activity_header_class_style?: string;

    activity_header_section_1_class_style?: string;

    activity_header_section_2_class_style?: string;

    activity_body_class_style?: string;

    activity_body_content_class_style?: string;

    select_checkbox_wrapper_class_style?: string;

    select_checkbox_class_style?: string;
}

export interface ActivityListUIRenderMethodsinterface {
    getRecordId?: (record: Record<string, any>) => string | number;

    onSelect?: (event: Event | InputEvent, record: Record<string, any>, checked: boolean) => void;

    renderHeaderSection1Content?: PropRenderFnType;

    renderHeaderSection2Content?: PropRenderFnType;

    renderBodyContent?: PropRenderFnType;
}


export interface ActivityListUIPropsInterface {
    select_mode: boolean;

    selected_records: (string | number)[];

    activity_records: Record<string, any>[];

    getRecordId: (record: Record<string, any>) => string | number;

    onSelect?: (event: Event | InputEvent, record: Record<string, any>, checked: boolean) => void;

    renderHeaderSection1Content: PropRenderFnType;

    renderHeaderSection2Content: PropRenderFnType;

    renderBodyContent: PropRenderFnType;

    loader_content_text?: string;

    wrapper_class_style: string;
    activity_wrapper_class_style: string;
    activity_header_class_style: string;
    activity_header_section_1_class_style: string;
    activity_header_section_2_class_style: string;
    activity_body_class_style: string;
    activity_body_content_class_style: string;
    select_checkbox_wrapper_class_style: string;
    select_checkbox_class_style: string;
}


import { SelectOptionInterface } from "../ui_types/input_ui_type";

export interface CountryCurrencyInterface {
    code: string;
    name: string;
    symbol?: string;
}

export interface CountryStateInterface {
    name: string;
    state_code?: string;
}

export interface CountryDataInterface {
    name: string;
    official_name?: string;
    iso2: string;
    iso3: string;
    numeric_code?: string;
    capital?: string;
    default_currency?: CountryCurrencyInterface;
    region?: string;
    subregion?: string;
    states: CountryStateInterface[];
}

export interface CountryDataFileInterface {
    metadata: {
        generated_at: string;
        country_count: number;
        sources: string[];
    };
    countries: CountryDataInterface[];
}

export type CountryDataFieldKey = keyof CountryDataInterface;

export type CountryDataValueKey =
    | "name"
    | "official_name"
    | "iso2"
    | "iso3"
    | "numeric_code"
    | "capital"
    | "default_currency.code"
    | "default_currency.name";

export type CountryDataSearchKey = CountryDataValueKey | "region" | "subregion" | "states.name" | "states.state_code";

export type CountryDataSortKey = "name" | "iso2" | "iso3" | "capital" | "region";

export interface CountryDataFilterOptions<TField extends CountryDataFieldKey = CountryDataFieldKey> {
    search?: string;
    search_keys?: CountryDataSearchKey[];
    region?: string;
    subregion?: string;
    currency_code?: string;
    has_states?: boolean;
    sort_by?: CountryDataSortKey;
    sort_direction?: "asc" | "desc";
    limit?: number;
    fields?: TField[];
}

export interface CountryStateFilterOptions {
    search?: string;
    sort_direction?: "asc" | "desc";
    limit?: number;
}

export interface CountrySelectOptionInterface<TData = CountryDataInterface> extends SelectOptionInterface {
    data?: TData;
}

export interface CountrySelectOptionOptions<
    TData = CountryDataInterface
> extends CountryDataFilterOptions<CountryDataFieldKey> {
    label_key?: CountryDataValueKey;
    value_key?: CountryDataValueKey;
    include_data?: boolean;
    map_label?: (country: CountryDataInterface) => string;
    map_value?: (country: CountryDataInterface) => string | number;
    map_data?: (country: CountryDataInterface) => TData;
}

export interface CountryStateSelectOptionOptions extends CountryStateFilterOptions {
    label_key?: keyof CountryStateInterface;
    value_key?: keyof CountryStateInterface;
    include_data?: boolean;
}

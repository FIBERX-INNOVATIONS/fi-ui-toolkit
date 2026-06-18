import country_data_resource from "../resources/country_data.json";
import {
    CountryDataFieldKey,
    CountryDataFileInterface,
    CountryDataFilterOptions,
    CountryDataInterface,
    CountryDataSearchKey,
    CountryDataValueKey,
    CountrySelectOptionInterface,
    CountrySelectOptionOptions,
    CountryStateFilterOptions,
    CountryStateInterface,
    CountryStateSelectOptionOptions
} from "../types/country_data_type";
import { SelectOptionInterface } from "../ui_types/input_ui_type";

class CountryDataUtil {
    private static country_data = country_data_resource as CountryDataFileInterface;

    public static getMetadata(): CountryDataFileInterface["metadata"] {
        return CountryDataUtil.country_data.metadata;
    }

    public static getCountries<TField extends CountryDataFieldKey = CountryDataFieldKey>(
        options: CountryDataFilterOptions<TField> = {}
    ): Array<Pick<CountryDataInterface, TField>> {
        const countries = CountryDataUtil.filterCountries(options);

        if (!options.fields?.length) {
            return countries as Array<Pick<CountryDataInterface, TField>>;
        }

        return countries.map((country) => {
            return options.fields!.reduce(
                (selected_country, field) => {
                    selected_country[field] = country[field];
                    return selected_country;
                },
                {} as Pick<CountryDataInterface, TField>
            );
        });
    }

    public static getCountry(
        value: string | number,
        value_key: CountryDataValueKey = "iso2"
    ): CountryDataInterface | undefined {
        const normalized_value = CountryDataUtil.normalizeSearchValue(value);

        return CountryDataUtil.country_data.countries.find((country) => {
            return (
                CountryDataUtil.normalizeSearchValue(CountryDataUtil.getCountryValue(country, value_key)) ===
                normalized_value
            );
        });
    }

    public static getCountryOptions(options: CountrySelectOptionOptions = {}): CountrySelectOptionInterface[] {
        const countries = CountryDataUtil.filterCountries(options);

        return countries.map((country) => {
            const label_text =
                options.map_label?.(country) ??
                String(CountryDataUtil.getCountryValue(country, options.label_key ?? "name") ?? "");
            const value =
                options.map_value?.(country) ??
                CountryDataUtil.toSelectValue(CountryDataUtil.getCountryValue(country, options.value_key ?? "iso2"));

            const option: CountrySelectOptionInterface = {
                label_text,
                value,
                data: options.map_data?.(country) ?? country
            };

            if (options.include_data === false) {
                delete (option as Partial<CountrySelectOptionInterface>).data;
            }

            return option;
        });
    }

    public static getStates(
        country_value: string | number,
        country_value_key: CountryDataValueKey = "iso2",
        options: CountryStateFilterOptions = {}
    ): CountryStateInterface[] {
        const country = CountryDataUtil.getCountry(country_value, country_value_key);

        if (!country) {
            return [];
        }

        return CountryDataUtil.filterStates(country.states, options);
    }

    public static getStateOptions(
        country_value: string | number,
        country_value_key: CountryDataValueKey = "iso2",
        options: CountryStateSelectOptionOptions = {}
    ): Array<SelectOptionInterface & { data?: CountryStateInterface }> {
        return CountryDataUtil.getStates(country_value, country_value_key, options).map((state) => {
            const label_text = String(state[options.label_key ?? "name"] ?? "");
            const value = CountryDataUtil.toSelectValue(state[options.value_key ?? "state_code"] ?? state.name);
            const option: SelectOptionInterface & { data?: CountryStateInterface } = { label_text, value };

            if (options.include_data !== false) {
                option.data = state;
            }

            return option;
        });
    }

    private static filterCountries(options: CountryDataFilterOptions = {}): CountryDataInterface[] {
        const search_keys = options.search_keys ?? [
            "name",
            "official_name",
            "iso2",
            "iso3",
            "capital",
            "default_currency.code",
            "default_currency.name"
        ];
        const search = CountryDataUtil.normalizeSearchValue(options.search ?? "");

        const countries = CountryDataUtil.country_data.countries.filter((country) => {
            if (
                options.region &&
                CountryDataUtil.normalizeSearchValue(country.region) !==
                    CountryDataUtil.normalizeSearchValue(options.region)
            ) {
                return false;
            }

            if (
                options.subregion &&
                CountryDataUtil.normalizeSearchValue(country.subregion) !==
                    CountryDataUtil.normalizeSearchValue(options.subregion)
            ) {
                return false;
            }

            if (
                options.currency_code &&
                CountryDataUtil.normalizeSearchValue(country.default_currency?.code) !==
                    CountryDataUtil.normalizeSearchValue(options.currency_code)
            ) {
                return false;
            }

            if (typeof options.has_states === "boolean" && country.states.length > 0 !== options.has_states) {
                return false;
            }

            if (!search) {
                return true;
            }

            return search_keys.some((key) => {
                return CountryDataUtil.getSearchValues(country, key).some((value) => {
                    return CountryDataUtil.normalizeSearchValue(value).includes(search);
                });
            });
        });

        const sorted_countries = CountryDataUtil.sortCountries(
            countries,
            options.sort_by ?? "name",
            options.sort_direction ?? "asc"
        );

        return CountryDataUtil.applyLimit(sorted_countries, options.limit);
    }

    private static filterStates(
        states: CountryStateInterface[],
        options: CountryStateFilterOptions
    ): CountryStateInterface[] {
        const search = CountryDataUtil.normalizeSearchValue(options.search ?? "");
        const filtered_states = states.filter((state) => {
            if (!search) {
                return true;
            }

            return [state.name, state.state_code].some((value) =>
                CountryDataUtil.normalizeSearchValue(value).includes(search)
            );
        });

        const direction_modifier = options.sort_direction === "desc" ? -1 : 1;
        const sorted_states = [...filtered_states].sort((state_a, state_b) => {
            return state_a.name.localeCompare(state_b.name) * direction_modifier;
        });

        return CountryDataUtil.applyLimit(sorted_states, options.limit);
    }

    private static sortCountries(
        countries: CountryDataInterface[],
        sort_by: NonNullable<CountryDataFilterOptions["sort_by"]>,
        sort_direction: NonNullable<CountryDataFilterOptions["sort_direction"]>
    ): CountryDataInterface[] {
        const direction_modifier = sort_direction === "desc" ? -1 : 1;

        return [...countries].sort((country_a, country_b) => {
            const country_a_value = CountryDataUtil.getCountryValue(country_a, sort_by);
            const country_b_value = CountryDataUtil.getCountryValue(country_b, sort_by);

            return String(country_a_value ?? "").localeCompare(String(country_b_value ?? "")) * direction_modifier;
        });
    }

    private static getCountryValue(
        country: CountryDataInterface,
        key: CountryDataValueKey | "region" | "subregion"
    ): string | undefined {
        switch (key) {
            case "default_currency.code":
                return country.default_currency?.code;
            case "default_currency.name":
                return country.default_currency?.name;
            default:
                return country[key];
        }
    }

    private static getSearchValues(
        country: CountryDataInterface,
        key: CountryDataSearchKey
    ): Array<string | undefined> {
        switch (key) {
            case "states.name":
                return country.states.map((state) => state.name);
            case "states.state_code":
                return country.states.map((state) => state.state_code);
            default:
                return [CountryDataUtil.getCountryValue(country, key)];
        }
    }

    private static normalizeSearchValue(value: unknown): string {
        return String(value ?? "")
            .trim()
            .toLowerCase();
    }

    private static toSelectValue(value: unknown): string | number {
        if (typeof value === "number") {
            return value;
        }

        return String(value ?? "");
    }

    private static applyLimit<T>(records: T[], limit?: number): T[] {
        if (!limit || limit < 1) {
            return records;
        }

        return records.slice(0, limit);
    }
}

export default CountryDataUtil;

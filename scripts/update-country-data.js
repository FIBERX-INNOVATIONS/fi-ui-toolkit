#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const outputPath = path.join(projectRoot, "src", "version_3", "resources", "country_data.json");

const sources = {
    countriesNowStates: "https://countriesnow.space/api/v0.1/countries/states",
    countriesNowCapitals: "https://countriesnow.space/api/v0.1/countries/capital",
    countriesNowCurrencies: "https://countriesnow.space/api/v0.1/countries/currency",
    currencyNames: "https://openexchangerates.org/api/currencies.json"
};

async function fetchJson(url) {
    const response = await fetch(url, {
        headers: {
            "user-agent": "fi-ui-toolkit-country-data-updater"
        }
    });

    if (!response.ok) {
        throw new Error(`${url} responded with ${response.status}`);
    }

    return response.json();
}

function normalizeText(value) {
    return String(value ?? "").trim();
}

function normalizeCode(value) {
    return normalizeText(value).toUpperCase();
}

function getCountriesNowData(response, sourceName) {
    if (!Array.isArray(response?.data)) {
        throw new Error(`${sourceName} did not return a data array`);
    }

    return response.data;
}

function buildCountryKey(country) {
    const iso2 = normalizeCode(country.iso2);
    const iso3 = normalizeCode(country.iso3);

    if (iso2) {
        return `iso2:${iso2}`;
    }

    if (iso3) {
        return `iso3:${iso3}`;
    }

    return `name:${normalizeText(country.name).toLowerCase()}`;
}

function ensureCountry(countryMap, sourceCountry) {
    const key = buildCountryKey(sourceCountry);
    const country = countryMap.get(key) ?? {
        name: normalizeText(sourceCountry.name),
        iso2: normalizeCode(sourceCountry.iso2),
        iso3: normalizeCode(sourceCountry.iso3),
        states: []
    };

    country.name = country.name || normalizeText(sourceCountry.name);
    country.iso2 = country.iso2 || normalizeCode(sourceCountry.iso2);
    country.iso3 = country.iso3 || normalizeCode(sourceCountry.iso3);

    countryMap.set(key, country);
    return country;
}

function applyStates(countryMap, statesResponse) {
    for (const country of getCountriesNowData(statesResponse, "CountriesNow states")) {
        const targetCountry = ensureCountry(countryMap, country);
        const states = Array.isArray(country.states) ? country.states : [];
        targetCountry.states = states
            .map((state) => ({
                name: normalizeText(state.name),
                ...(state.state_code ? { state_code: normalizeText(state.state_code) } : {})
            }))
            .filter((state) => state.name)
            .sort((state_a, state_b) => state_a.name.localeCompare(state_b.name));
    }
}

function applyCapitals(countryMap, capitalsResponse) {
    for (const country of getCountriesNowData(capitalsResponse, "CountriesNow capitals")) {
        const targetCountry = ensureCountry(countryMap, country);
        const capital = normalizeText(country.capital);

        if (capital) {
            targetCountry.capital = capital;
        }
    }
}

function applyCurrencies(countryMap, currenciesResponse, currencyNames) {
    for (const country of getCountriesNowData(currenciesResponse, "CountriesNow currencies")) {
        const targetCountry = ensureCountry(countryMap, country);
        const currencyCode = normalizeCode(country.currency);

        if (currencyCode) {
            targetCountry.default_currency = {
                code: currencyCode,
                name: normalizeText(currencyNames?.[currencyCode]) || currencyCode
            };
        }
    }
}

async function main() {
    console.log("Fetching country data...");
    const [statesResponse, capitalsResponse, currenciesResponse, currencyNames] = await Promise.all([
        fetchJson(sources.countriesNowStates),
        fetchJson(sources.countriesNowCapitals),
        fetchJson(sources.countriesNowCurrencies),
        fetchJson(sources.currencyNames)
    ]);

    const countryMap = new Map();
    applyStates(countryMap, statesResponse);
    applyCapitals(countryMap, capitalsResponse);
    applyCurrencies(countryMap, currenciesResponse, currencyNames);

    const countries = Array.from(countryMap.values())
        .filter((country) => country.name && country.iso2 && country.iso3)
        .sort((country_a, country_b) => country_a.name.localeCompare(country_b.name));

    const countryData = {
        metadata: {
            generated_at: new Date().toISOString(),
            country_count: countries.length,
            sources: Object.values(sources)
        },
        countries
    };

    fs.writeFileSync(outputPath, `${JSON.stringify(countryData, null, 4)}\n`, "utf8");
    console.log(`Updated ${path.relative(projectRoot, outputPath)} with ${countries.length} countries.`);
}

main().catch((error) => {
    console.error(`Failed to update country data: ${error.message}`);
    process.exit(1);
});

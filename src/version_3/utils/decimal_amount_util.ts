class DecimalAmountUtil {
    /**
     * Normalizes a positive decimal amount.
     *
     * This method validates that:
     * - The precision is valid.
     * - The amount contains only numbers, commas and an optional decimal point.
     * - The number of decimal places does not exceed the allowed precision.
     * - The amount is greater than zero.
     *
     * Examples:
     *
     * normalize("1,000.50", 2) => "1000.50"
     * normalize("100.898", 2)  => null
     */
    public static normalize(value: string, precision: number): string | null {
        // Precision must be a whole number between 0 and 100.
        if (!Number.isInteger(precision) || precision < 0 || precision > 100) {
            return null;
        }

        const text = value.trim();

        // Allow:
        // 100
        // 100.50
        // 1,000
        // 1,000.50
        if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(text)) {
            return null;
        }

        // Remove grouping commas before processing.
        const [integer, fraction = ""] = text.replace(/,/g, "").split(".");

        // Reject amounts that contain more decimal places
        // than the selected currency supports.
        if (fraction.length > precision) {
            return null;
        }

        // Reject zero values such as:
        // 0
        // 0.00
        // 000.000
        if (!/[1-9]/.test(integer + fraction)) {
            return null;
        }

        // Remove unnecessary leading zeros.
        const whole = integer.replace(/^0+(?=\d)/, "");

        // Return the normalized decimal string.
        return fraction ? `${whole}.${fraction}` : whole;
    }

    /**
     * Truncates an amount to the specified currency precision.
     *
     * IMPORTANT:
     * This does NOT round the amount.
     * Extra decimal digits are simply removed.
     *
     * Examples:
     *
     * truncatePrecision("100.898", 2) => "100.89"
     * truncatePrecision("100.899", 2) => "100.89"
     * truncatePrecision("100.8", 2)   => "100.8"
     * truncatePrecision("100.89", 0)  => "100"
     */
    public static truncatePrecision(value: string, precision: number): string {
        // If the precision is invalid, return the original value.
        if (!Number.isInteger(precision) || precision < 0 || precision > 100) {
            return value;
        }

        // Remove grouping commas before manipulating the amount.
        const cleanValue = value.replace(/,/g, "");

        // Split the amount into its whole-number and decimal portions.
        const [integer, fraction] = cleanValue.split(".");

        // If the currency has no decimal precision,
        // return only the whole-number portion.
        if (precision === 0) {
            return integer;
        }

        // If the user has not entered a decimal point,
        // there is nothing to truncate.
        if (fraction === undefined) {
            return integer;
        }

        // Keep only the number of decimal digits
        // supported by the currency.
        const truncatedFraction = fraction.slice(0, precision);

        // Preserve the decimal point while the user is typing,
        // for example "100.".
        if (truncatedFraction.length === 0) {
            return `${integer}.`;
        }

        return `${integer}.${truncatedFraction}`;
    }

    /**
     * Applies an exact currency precision to a server decimal.
     *
     * This method is useful when a server value must have exactly
     * the number of decimal places required by a currency.
     *
     * Examples:
     *
     * withPrecision("100", 2)    => "100.00"
     * withPrecision("100.5", 2)  => "100.50"
     * withPrecision("100.500", 2) => "100.50"
     *
     * If significant digits would be lost, null is returned.
     */
    public static withPrecision(value: string, precision: number): string | null {
        if (!Number.isInteger(precision) || precision < 0 || precision > 100 || !/^\d+(?:\.\d+)?$/.test(value)) {
            return null;
        }

        const [integer, fraction = ""] = value.split(".");

        // Check whether removing digits after the allowed precision
        // would remove any significant non-zero values.
        if (/[1-9]/.test(fraction.slice(precision))) {
            return null;
        }

        // Remove unnecessary leading zeros.
        const whole = integer.replace(/^0+(?=\d)/, "");

        // Add trailing zeros until the required precision is reached.
        return precision ? `${whole}.${fraction.slice(0, precision).padEnd(precision, "0")}` : whole;
    }

    /**
     * Adds thousands separators to a decimal string.
     *
     * No floating-point conversion is performed.
     *
     * Examples:
     *
     * group("1000")       => "1,000"
     * group("1000.50")    => "1,000.50"
     * group("1000000.25") => "1,000,000.25"
     */
    public static group(value: string): string {
        // If the value is not a valid decimal string,
        // return it unchanged.
        if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?$/.test(value)) {
            return value;
        }

        // Remove existing commas before regrouping.
        const [integer, fraction] = value.replace(/,/g, "").split(".");

        if (!/^\d+$/.test(integer)) {
            return value;
        }

        // Add a comma before every group of three digits.
        const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        // Preserve the decimal portion if one exists.
        return fraction === undefined ? grouped : `${grouped}.${fraction}`;
    }
}

export default DecimalAmountUtil;

declare module 'flowbite-datepicker' {

    export type DateInput = Date | string | number;
    export type DateValue = Date | Date[] | string | string[] | undefined;

    export interface DatepickerOptions {
        buttonClass?: string;
        container?: HTMLElement | string;
        defaultViewDate?: Date;
        maxDate?: Date | number | string;
        minDate?: Date | number | string;

        format?: string;
        locale?: string;

        autohide?: boolean;
        multidate?: boolean;
        maxNumberOfDates?: number;

        dateDelimiter?: string;
        pickLevel?: number;

        datesDisabled?: number[];
        daysOfWeekDisabled?: number[];

        startView?: number;
    }

    export interface SetDateOptions {
        clear?: boolean;
        render?: boolean;
        autohide?: boolean;
    }

    export class Datepicker {
        constructor(
            element: HTMLElement,
            options?: DatepickerOptions,
            rangepicker?: DateRangePicker
        );

        element: HTMLElement;
        config: DatepickerOptions;

        dates: number[];

        inline: boolean;
        inputField?: HTMLInputElement;

        active: boolean;
        pickerElement?: HTMLDivElement;

        show(): void;
        hide(): void;
        destroy(): this;

        setOptions(options: DatepickerOptions): void;

        getDate(format?: string): DateValue;

        setDate(...dates: [...DateInput[], SetDateOptions?]): void;

        update(options?: { autohide?: boolean }): void;

        refresh(target?: 'picker' | 'input', forceRender?: boolean): void;

        enterEditMode(): void;
        exitEditMode(options?: { update?: boolean }): void;

        // Static helpers
        static formatDate(
            date: Date | number,
            format: string,
            lang?: string
        ): string;

        static parseDate(
            dateStr: string | Date | number,
            format: string,
            lang?: string
        ): number;

        static locales: Record<string, any>;
    }

    export interface DateRangePickerOptions extends DatepickerOptions {
        inputs?: [HTMLInputElement, HTMLInputElement];
        [key]: any;
    }

    export class DateRangePicker {
        constructor(
            element: HTMLElement,
            options: DateRangePickerOptions
        );

        element: HTMLElement;

        inputs: [HTMLInputElement, HTMLInputElement];
        datepickers: [Datepicker, Datepicker];

        show(): void;
        hide(): void;
        destroy(): void;

        setOptions(options: DateRangePickerOptions): void;
    }
}
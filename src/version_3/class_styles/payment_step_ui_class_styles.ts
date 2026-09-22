import type { PaymentStepClassStylesInterface } from "../ui_types/payment_step_ui_type";
const PaymentStepUIClassStyles: PaymentStepClassStylesInterface = {
    flow_wrapper: "space-y-5 min-w-0",
    wrapper: "space-y-5 min-w-0",
    title: "text-xl font-semibold text-slate-900",
    subtitle: "text-sm leading-relaxed text-slate-500",
    field: "space-y-2 min-w-0",
    label: "block text-sm font-medium text-slate-700",
    error: "rounded-xl bg-rose-50 p-3 text-sm text-rose-700",
    options: "space-y-3 border-0 p-0 min-w-0",
    option: "relative flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition-colors hover:border-blue-400 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-500 has-[:disabled]:opacity-60",
    radio: "peer sr-only",
    option_body: "flex-1 min-w-0",
    option_name: "block break-words font-medium text-slate-900",
    option_description: "mt-1 block break-words text-sm text-slate-500",
    check: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-300 text-transparent transition-all duration-200 peer-checked:scale-110 peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-checked:text-white motion-reduce:transition-none",
    row: "flex items-start justify-between gap-5 border-b border-slate-100 py-3 text-sm",
    value: "max-w-[65%] break-words text-right font-medium text-slate-900",
    total: "rounded-xl bg-slate-50 p-4",
    footer: "flex justify-end border-t border-slate-100 pt-5",
    button: {
        wrapper_class_style: "",
        loading_class_style: "opacity-70",
        text_class_style: "",
        button_class_style:
            "rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-blue-500",
        disabled_class_style: "opacity-50 cursor-not-allowed",
        content_class_style: "flex items-center justify-center gap-2",
        icon_class_style: "h-4 w-4"
    },
    back_button: {
        wrapper_class_style: "",
        loading_class_style: "opacity-70",
        text_class_style: "",
        button_class_style:
            "rounded-lg px-1 py-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 focus-visible:outline-blue-500",
        disabled_class_style: "opacity-50 cursor-not-allowed",
        content_class_style: "flex items-center gap-2",
        icon_class_style: "h-4 w-4"
    },
    input: {
        wrapper_class_style: "relative w-full",
        caret_icon_class:
            "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-slate-400 [&_svg]:h-4 [&_svg]:w-4",
        input_class_style:
            "w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
    }
};
export default PaymentStepUIClassStyles;

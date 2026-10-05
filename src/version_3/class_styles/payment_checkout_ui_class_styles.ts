import type { PaymentCheckoutClassStylesInterface } from "../ui_types/payment_checkout_ui_type";
import PaymentStepUIClassStyles from "./payment_step_ui_class_styles";

const PaymentCheckoutUIClassStyles: PaymentCheckoutClassStylesInterface = {
    wrapper: "space-y-5 min-w-0",
    title: "text-xl font-semibold",
    subtitle: "text-sm leading-relaxed text-slate-500",
    notice: "rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed",
    error: "rounded-xl bg-rose-50 p-3 text-sm text-rose-700",
    rows: "rounded-xl border border-slate-200 px-4",
    row: "grid gap-1 border-b border-slate-100 py-3 text-sm last:border-0",
    value: "min-w-0 whitespace-pre-wrap break-all font-medium select-text",
    actions: "flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4",
    link: "inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium underline focus-visible:outline-blue-500",
    iframe: "h-[55dvh] min-h-80 w-full rounded-xl border border-slate-200 bg-white",
    button: PaymentStepUIClassStyles.button
};

export default PaymentCheckoutUIClassStyles;

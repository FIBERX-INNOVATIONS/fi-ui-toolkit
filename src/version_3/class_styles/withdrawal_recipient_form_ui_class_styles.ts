import type { RecipientFormClassStylesInterface } from "../ui_types/withdrawal_recipient_form_ui_type";

import Input from "./input_ui_class_styles";
import Group from "./input_group_ui_class_styles";
import Button from "./button_ui_class_styles";
import Tabs from "./tabs_ui_class_styles";

const styles: RecipientFormClassStylesInterface = {
    wrapper: "space-y-6",
    fields: "grid grid-cols-1 space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-4",
    section: "space-y-4 rounded-xl bg-slate-50 p-4",
    field: "min-w-0 space-y-2",
    resolution_error: "text-xs leading-5 text-red-700",
    retry_link: "ml-1 cursor-pointer font-semibold underline underline-offset-2 focus-visible:outline-2",
    help: "text-xs leading-5 text-slate-500",
    secondary_button: Button,
    title: "text-xl font-semibold",
    notice: "text-sm text-slate-600",
    error: "text-sm text-red-700",
    footer: "flex gap-3",
    review_section_wrapper: "grid grid-cols-1 space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-4",
    review_row: "flex justify-between gap-4 border-b py-3 break-all",
    input: Input,
    group: Group,
    button: Button,
    tabs: Tabs
};
export default styles;

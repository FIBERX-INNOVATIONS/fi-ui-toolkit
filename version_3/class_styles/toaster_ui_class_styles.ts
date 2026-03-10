
import {
    ToastStatusType,
    ToasterUIClassStylesInterface
} from "../ui_types/toaster_ui_type"

const ToasterUIClassStyles: ToasterUIClassStylesInterface = {

    wrapper_class_style: `
        fixed
        top-6
        right-6
        z-[9999]
        flex
        items-center
        gap-3
        px-4
        py-3
        rounded-lg
        shadow-lg
        text-white
        bg-gray-800
        min-w-[250px]
        max-w-[350px]
        animate-fade-in
    `,

    icon_wrapper_class_style: `
        flex
        items-center
        justify-center
        cursor-pointer
    `,

    icon_class_style: `
        text-lg
    `,

    message_class_style: `
        text-sm
        leading-relaxed
    `,

    border_class_style: (status?: ToastStatusType): string => {
        switch (status) {

            case "success":
                return "bg-green-100 border-l-green-900";

            case "error":
                return "bg-red-200 border-l-red-900";

            case "warning":
                return "bg-yellow-100 border-l-yellow-900";

            case "info":
                return "bg-blue-300 border-l-blue-900";

            default:
                return "";
        }
    },

    text_class_style: (status?: ToastStatusType): string => {
        switch (status) {

            case "success":
                return "text-sm font-semibold text-green-900 bg-green-100";

            case "error":
                return "text-sm font-semibold text-red-900 bg-red-200";

            case "warning":
                return  "text-sm font-semibold text-amber-900 bg-yellow-100";

            case "info":
                return "text-sm font-semibold text-blue-900 bg-blue-300";

            default:
                return "";
        }
    },

}


export default ToasterUIClassStyles;

import { ClassStyles }     from "./list_loader_ui_class_styles";

const ListLoaderUIProps   = {
    wrapper_class_style: { type: String, default: ClassStyles?.wrapper_class_style, required: false },

    number_of_bars: { type: Number, default: 10, required: false },

    bar_class_style: { type: String, default: ClassStyles?.bar_class_style, required: false },
}

export default ListLoaderUIProps;
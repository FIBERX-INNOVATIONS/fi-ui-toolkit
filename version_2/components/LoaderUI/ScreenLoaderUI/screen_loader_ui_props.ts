
import { ClassStyles }     from "./screen_loader_ui_class_styles";


const ScreenLoaderUIProps   = {
    visible: { type: Boolean, default: false, required: false },

    wrapper_class_style: { type: String, default: ClassStyles?.wrapper_class_style, required: false },

    loader_class_style: { type: String, default: ClassStyles?.loader_class_style, required: false },

    loader_symbol_class_style: { type: String, default: ClassStyles?.loader_symbol_class_style, required: false },

    loader_text_class_style: { type: String, default: ClassStyles?.loader_text_class_style, required: false },

    loader_symbol: { type: Object, default: {}, required: false },

    loader_text: { type: String, default: "Loading...", required: false },
}

export default ScreenLoaderUIProps;
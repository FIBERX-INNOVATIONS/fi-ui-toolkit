
import { ClassStyles }     from "./screen_loader_ui_class_styles";


const ScreenLoaderUIProps   = {
    visible: { type: Boolean, default: false, required: false },

    class_styles: { type: Object, default: ClassStyles, required: false },

    loader_symbol: { type: Object, default: {}, required: false },

    loader_text: { type: String, default: "Loading...", required: false },
}

export default ScreenLoaderUIProps;
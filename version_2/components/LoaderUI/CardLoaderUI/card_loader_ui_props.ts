import { ClassStyles } from "./card_loader_ui_class_styles";


const CardLoaderUIProps = {
    number_of_cards: { type: Number, default: 10, required: false },

    wrapper_class_style: { type: String, default: ClassStyles.wrapper_class_style, required: false },
};

export default CardLoaderUIProps;

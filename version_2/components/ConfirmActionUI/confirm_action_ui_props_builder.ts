
import { reactive, Component  }         from "vue";
import { ComponentClassStyles }         from "../../enums/component_class_styles.enums";
import RenderHtmlUtil                   from "../../utils/render_html_util";
import { ButtonUIPropsInterface }       from "../../types/props_builder_type"
import { BaseEventHandlerInterface }    from "../../types/component_type";


class ConfirmActionUIPorpsBuilder {
    public readonly name = "confirm_action_ui_props_builder";

    // Method to get page form action button props
    public static getCancelBtnProps (
        event_handler: BaseEventHandlerInterface,
        cancel_btn_content: string,
    ): ButtonUIPropsInterface {
        const class_styles              = ComponentClassStyles?.confirm_action_ui?.cancel_action_btn_ui ?? {};
        const btn_class_style           = class_styles?.btn_class_style
        const btn_type                  = "button";
        const content_text              = cancel_btn_content;
        const loader_content_text       = RenderHtmlUtil.renderLoaderHtml({});
        const on_click                  = event_handler?.handleCancelBtnClick.bind(event_handler);

        return reactive({
            type: btn_type, disabled: false, show_loader: true, 
            content_text, loader_content_text, btn_class_style, on_click
        })
    }

    public static getConfirmBtnProps (
        event_handler: BaseEventHandlerInterface,
        confirm_btn_content: string,
    ): ButtonUIPropsInterface {
        const class_styles              = ComponentClassStyles?.confirm_action_ui?.confirm_action_btn_ui ?? {};
        const btn_class_style           = class_styles?.btn_class_style
        const btn_type                  = "button";
        const content_text              = confirm_btn_content;
        const loader_content_text       = RenderHtmlUtil.renderLoaderHtml({});
        const on_click                  = event_handler?.handleConfirmBtnClick.bind(event_handler);

        return reactive({
            type: btn_type, disabled: false, show_loader: true, 
            content_text, loader_content_text, btn_class_style, on_click
        })
    }


}

export default ConfirmActionUIPorpsBuilder;
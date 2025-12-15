
import { ref }                      from "vue";
import BaseController               from "../../base_classes/base_controller";
import ModalUIEventHandler          from "./modal_ui_event_handler";
import { ClassStyles }              from "./modal_ui_class_styles";

class ModalUIController extends BaseController {
    public event_handler: ModalUIEventHandler;

    constructor(props: Record<string, any> = {}) {
        super("modal_event_handler_ui", props);
        this.event_handler = new ModalUIEventHandler(this);
    }

    // Method to get modal position class style
    private getModalPositionClassStyle = (): string => {
        const { position = "center" } = this.props;
        const ui_class_styles           = ClassStyles;

        if (position === "left") { return ui_class_styles.left_modal_position_class_style; }

        if (position === "right") { return ui_class_styles.right_modal_position_class_style; }

        return ui_class_styles.center_modal_position_class_style;

    }

    // Method to get modal size class style
    private getModalSizeClassStyle = (): string => {
        const { position = "center", width } = this.props;

        if (position === "left" || position === "right") { return `${width} h-full`; }

        return `${width} max-h-[90vh]`;
    }


    // Method to get modal transition name
    getModaltranstionName = (): string => {
        const { position = "center", width } = this.props;

        if (position === "left") { return "slide-left"; }

        if (position === "right") { return "slide-right"; }

        return "pop-center";
    }

    // Method to get ui state data
    protected getUIStateData(): Record<string, any> { 
        return {
            clicked: ref(false),
            btn_content: ref(null)
        } 
    }

    // Method to to get ui computed data
    protected getUIComputedData(): Record<string, () => any> { 
        return {
            modal_position_class_style: this.getModalPositionClassStyle,

            modal_size_class_style: this.getModalSizeClassStyle,

            modal_transition_name: this.getModaltranstionName
        }; 
    }

    // Method to get ui watchers
    protected getUIWatchers(): Record<string, (new_val: any, old_val: any) => void> { 
        return {
            clicked: (new_val, old_val) => {
                const { loader_content_text, close_btn_content } = this.props;

                const should_show_loading   = new_val === true && loader_content_text;
                const new_btn_content       = should_show_loading ? loader_content_text :  null;
                
                this.state_refs.btn_content.value = new_btn_content;
                return;
            },
        }; 
    }
}

export default ModalUIController;
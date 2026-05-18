import { BaseControllerInterface } from "../types/component_type";
import LoggerUtil from "../utils/logger_util";
import { InputEventMethodOptions } from "../types/input_ui_type";

class BaseEventHandler {
    public readonly name: string;
    public readonly component_name: string;
    public form_data: Record<string, any>;
    protected controller: BaseControllerInterface;
    protected logger: LoggerUtil;

    constructor(controller: BaseControllerInterface, component_name: string) {
        this.controller = controller;
        this.component_name = component_name;
        this.name = `${component_name}_event_handler`;
        this.logger = new LoggerUtil({ prefix: this.name, show_timestamp: false });
        this.form_data = {};
    }

    // Method to handle click event
    public handleOnClick(event: MouseEvent, options?: InputEventMethodOptions) {
        this.logger.log("Clicked!", event);
    }
}

export default BaseEventHandler;

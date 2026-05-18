import { BaseControllerInterface } from "../types/component_type";
import LoggerUtil from "../utils/logger_util";

class BaseService {
    public readonly name: string;
    public readonly component_name: string;
    protected controller: BaseControllerInterface;
    protected logger: LoggerUtil;

    constructor(controller: BaseControllerInterface, component_name: string) {
        this.controller = controller;
        this.component_name = component_name;
        this.name = `${component_name}_service`;
        this.logger = new LoggerUtil({ prefix: this.name, show_timestamp: false });
    }
}

export default BaseService;

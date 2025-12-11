
import BaseEventHandler             from "../../base_classes/base_event_handler";
import { BaseControllerInterface }  from "../../types/component_type";

class ActivityListUIEventHandler extends BaseEventHandler {
    constructor(controller: BaseControllerInterface) {
        super(controller, controller.component_name);
    }

    // Method to check if a record is selected
    public isRecordSelected (record: Record<string, any>): boolean {
        const { props = {} } = this.controller;
        const { 
            selected_records = [],
            getRecordId
        } = props;

        if (!selected_records || selected_records.length === 0) { return false; }

        const id = getRecordId(record);
        
        return selected_records.includes(id);
    };

    // Method to handle on record selected
    public async handleOnSelected (event: Event | MouseEvent, record: Record<string, any>, index: number) :Promise<void> {
        this.controller.state_refs.is_loading.value = true;
        try {
            const target                    = event.target as HTMLInputElement;
            const is_checked                = target?.checked;
            const { props = {} }            = this.controller;
            const { getRecordId, onSelect } = props;
            const id                        = getRecordId(record);
            const result                    = await onSelect(event, record, is_checked);
        }

        catch(error: unknown) { console.error(`[${this.controller.name}] handleOnSelected error:`, error); }

        finally { this.controller.state_refs.is_loading.value = false }

    }
}

export default ActivityListUIEventHandler;
import BaseController from "../base_classes/base_controller";

import { ComputedDefinitionType } from "../types/base_type";

import {
    CopyRightUIPropsInterface,
    CopyRightUIStateDataInterface,
    CopyRightUIComputedDataInterface
} from "../ui_types/copy_rigth_ui_type";

class CopyRightUIController extends BaseController<
    CopyRightUIPropsInterface,
    CopyRightUIStateDataInterface,
    CopyRightUIComputedDataInterface
> {
    constructor(props: CopyRightUIPropsInterface) {
        super("copy_right_ui", props);

        this.getComponentDefinition();
    }

    protected getUIStateData(): CopyRightUIStateDataInterface {
        return {
            current_year: new Date().getFullYear().toString(),

            is_initialized: true
        };
    }

    protected getUIComputedData(): ComputedDefinitionType<CopyRightUIComputedDataInterface> {
        return {
            display_year: () => {
                return this.props.year_text || this.state_refs.current_year.value;
            },

            copyright_text: () => {
                const year = this.computed_refs.display_year.value;

                const powered_by = this.props.powered_by_text || "";

                const author = this.props.author_text || "";

                return `© ${[year, powered_by, author].filter(Boolean).join(" ")}`;
            }
        };
    }
}

export default CopyRightUIController;

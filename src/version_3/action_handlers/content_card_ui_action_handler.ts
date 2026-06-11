import BaseActionHandler from "../base_classes/base_action_handler";
import BaseController from "../base_classes/base_controller";

import {
    ContentCardUIComponentsInterface,
    ContentCardUIComputedDataInterface,
    ContentCardUIPropsInterface,
    ContentCardUIStateDataInterface
} from "../ui_types/content_card_ui_type";

/* Method to handle ContentCardUI user actions. */
class ContentCardUIActionHandler extends BaseActionHandler<
    ContentCardUIPropsInterface,
    ContentCardUIStateDataInterface,
    ContentCardUIComputedDataInterface,
    ContentCardUIComponentsInterface
> {
    /* Method to create the action handler. */
    constructor(
        controller: BaseController<
            ContentCardUIPropsInterface,
            ContentCardUIStateDataInterface,
            ContentCardUIComputedDataInterface,
            ContentCardUIComponentsInterface
        >
    ) {
        super(controller);
    }

    /* Method to handle the card action button click. */
    public handleActionClick = async (event: MouseEvent): Promise<void> => {
        if (this.props.boolean_props?.disabled) {
            return;
        }

        await this.runWithLoading(
            "is_loading",
            async () => {
                const { title_text = "", media_link = "", description_text = "" } = this.props.content_props || {};
                const { on_click } = this.props.action_props || {};

                const result = await this.invokeAction(on_click, title_text, media_link, description_text, event, {
                    props: this.props
                });

                this.setErrorFromResult(result);
            },
            { prevent_when_loading: true }
        );
    };

    /* Method to clear the media error state after a successful load. */
    public handleMediaLoad = (): void => {
        this.setState("has_media_error", false);
    };

    /* Method to hide media that fails to load. */
    public handleMediaError = (): void => {
        this.setState("has_media_error", true);
    };
}

export default ContentCardUIActionHandler;

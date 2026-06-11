import { ComputedDefinitionType, WatchersType } from "../types/base_type";

import {
    ContentCardUIComponentsInterface,
    ContentCardUIComputedDataInterface,
    ContentCardUIPropsInterface,
    ContentCardUIStateDataInterface
} from "../ui_types/content_card_ui_type";

import BaseController from "../base_classes/base_controller";

import ContentCardUIActionHandler from "../action_handlers/content_card_ui_action_handler";

/* Method to manage ContentCardUI state and computed data. */
class ContentCardUIController extends BaseController<
    ContentCardUIPropsInterface,
    ContentCardUIStateDataInterface,
    ContentCardUIComputedDataInterface,
    ContentCardUIComponentsInterface
> {
    public override action_handler: ContentCardUIActionHandler;

    /* Method to create the controller and action handler. */
    constructor(props: ContentCardUIPropsInterface) {
        super("content_card_ui", props);

        this.action_handler = new ContentCardUIActionHandler(this);
        this.setActionHandler(this.action_handler);

        this.getComponentDefinition();
    }

    /* Method to provide child media components. */
    protected getUIComponents(): ContentCardUIComponentsInterface {
        return {
            ImgComponent: Image,
            VideoComponent: HTMLVideoElement
        };
    }

    /* Method to provide reactive state used by the template. */
    protected getUIStateData(): ContentCardUIStateDataInterface {
        return {
            is_loading: false,
            has_media_error: false,
            error_text: null
        };
    }

    /* Method to provide display state derived from props and state. */
    protected getUIComputedData(): ComputedDefinitionType<ContentCardUIComputedDataInterface> {
        return {
            has_title: (): boolean => {
                return Boolean(this.props.content_props?.title_text);
            },

            title_icon_is_after: (): boolean => {
                return this.props.content_props?.title_icon_position === "after";
            },

            has_media: (): boolean => {
                return Boolean(this.props.content_props?.media_link) && !this.state_refs.has_media_error.value;
            },

            is_video_media: (): boolean => {
                if (this.props.data_props?.media_type) {
                    return this.props.data_props.media_type === "video";
                }

                return this.isVideoLink(this.props.content_props?.media_link);
            },

            has_media_description: (): boolean => {
                return Boolean(this.props.content_props?.media_description_text) && this.computed_refs.has_media.value;
            },

            has_description: (): boolean => {
                return Boolean(this.props.content_props?.description_text);
            },

            has_action: (): boolean => {
                return Boolean(this.props.content_props?.button_text);
            },

            is_action_disabled: (): boolean => {
                return Boolean(this.props.boolean_props?.disabled) || this.state_refs.is_loading.value;
            },

            action_button_class: (): string => {
                const { class_styles } = this.props;
                const button_classes = [class_styles?.button_class_style || ""];

                if (this.state_refs.is_loading.value) {
                    button_classes.push(class_styles?.button_loading_class_style || "");
                }

                if (this.props.boolean_props?.disabled || this.state_refs.is_loading.value) {
                    button_classes.push(class_styles?.button_disabled_class_style || "");
                }

                return button_classes.filter(Boolean).join(" ");
            }
        };
    }

    /* Method to reset transient errors when content changes. */
    protected getUIWatchers(): WatchersType<ContentCardUIPropsInterface, ContentCardUIStateDataInterface> {
        return {
            content_props: {
                handler: () => {
                    this.state_refs.error_text.value = null;
                    this.state_refs.has_media_error.value = false;
                },
                options: { deep: true }
            }
        };
    }

    /* Method to infer video media from common video file extensions. */
    private isVideoLink(media_link?: string): boolean {
        if (!media_link) {
            return false;
        }

        const parsed_media_link = media_link.split("?")[0]?.toLowerCase() ?? "";

        return [".mp4", ".webm", ".ogg", ".mov", ".m4v"].some((extension) => parsed_media_link.endsWith(extension));
    }
}

export default ContentCardUIController;

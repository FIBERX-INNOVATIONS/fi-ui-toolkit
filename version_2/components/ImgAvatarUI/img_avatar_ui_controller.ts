
import BaseController               from "../../base_classes/base_controller";
import ImgAvatarUIEventHandler      from "./img_avatar_ui_event_handler";

class ImgAvatarUIController extends BaseController {
    public event_handler: ImgAvatarUIEventHandler;

    constructor(props: Record<string, any> = {}) {
        super("img_avatar_ui", props);

        this.event_handler = new ImgAvatarUIEventHandler(this);
    }

    // Method to get ui state data
    protected getUIStateData(): Record<string, any> { 
        return {}
    }

    // Method to to get ui computed data
    protected getUIComputedData(): Record<string, () => any> { 
        const isRouterLink = (link?: string) => !!link && link.startsWith("/");
        const isAnchor     = (link?: string) => !!link && /^https?:\/\//.test(link);

        return {
            component_type: () => {
               const { link } = this.props;
                if (isRouterLink(link)) { return "router-link"; }

                if (isAnchor(link)) { return "a"; }
                
                return "div";
            },

            route_link: () => {
                const { link } = this.props;
                return isRouterLink(link) ? link :  undefined;
            },

            anchor_link: () => {
                const { link } = this.props;
                return isAnchor(link) ? link :  undefined;
            },

            anchor_target: () => {
                const { link } = this.props;
                return isAnchor(link) ? "_blank" :  undefined;
            }
        }; 
    }

}

export default ImgAvatarUIController;

import { RouterLink, useRoute } from "vue-router";

import BaseController  from "../base_classes/base_controller";

import NavLinkUIActionHandler from "../action_handlers/nav_link_ui_action_handler";

import { ComputedDefinitionType } from "../types/base_type";

import { getSVGIconValue, SVGIconValue } from "../resources/svg_icon_resource";

import { 
    NavLinkUIPropsInterface,
    NavLinkUIStateDataInterface,
    NavLinkUIComputedDataInterface,
    NavLinkUIComponentsInterface,
} from "../ui_types/nav_link_ui_type";

class NavLinkUIController extends BaseController<
    NavLinkUIPropsInterface,
    NavLinkUIStateDataInterface,
    NavLinkUIComputedDataInterface,
    NavLinkUIComponentsInterface
>{

    public action_handler: NavLinkUIActionHandler =
        new NavLinkUIActionHandler(this);


    constructor(props: NavLinkUIPropsInterface) {
        super("nav_link_ui", props);
        this.getComponentDefinition();
    }

    protected getUIComponents(): NavLinkUIComponentsInterface {

        return {
            RouterLink
        };

    }

    protected getUIStateData(): NavLinkUIStateDataInterface {

        return {
            is_loading: false
        };

    }

    protected getUIComputedData(): ComputedDefinitionType<NavLinkUIComputedDataInterface> {

        return {

            component_type: () => {

                if (!this.props.link && this.props.action_props?.on_click) {
                    return "button";
                }

                if (this.props.link?.startsWith("/")) {
                    return RouterLink;
                }

                if (this.props.link?.startsWith("http")) {
                    return "a";
                }

                return "button";

            },

            route_link: () => {

                if (this.props.link?.startsWith("/")) {
                    return this.props.link;
                }

                return null;

            },

            anchor_link: () => {

                if (this.props.link?.startsWith("http")) {
                    return this.props.link;
                }

                return null;

            },

            anchor_target: () => {

                if (this.props.link?.startsWith("http")) {
                    return "_blank";
                }

                return null;

            },

            is_active_computed: () => {

                if (!this.props.link) return false;

                return this.route.path === this.props.link;

            },

            icon_svg: () => {

                return (getSVGIconValue(this.props.icon)) as SVGIconValue;

            }

        };

    }

}

export default NavLinkUIController;
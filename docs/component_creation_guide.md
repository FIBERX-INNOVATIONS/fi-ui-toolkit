# Component Creation Guide

This guide describes the expected pattern for creating new `src/version_3` UI components in FI UI Toolkit. It is written for human contributors and AI agents, so treat it as the checklist to follow before adding a component.

## Component Stack

Every new UI component should be built as a small stack of files. Use the existing `*_ui` naming style and keep each responsibility in its own layer.

Required files:

- `src/version_3/components/NewThingUI.vue`
- `src/version_3/controllers/new_thing_ui_controller.ts`
- `src/version_3/props/new_thing_ui_props.ts`
- `src/version_3/props_builder/new_thing_ui_props_builder.ts`
- `src/version_3/class_styles/new_thing_ui_class_styles.ts`
- `src/version_3/ui_types/new_thing_ui_type.ts`

Add an action handler when the component has events, async work, DOM event parsing, loading state, or side effects:

- `src/version_3/action_handlers/new_thing_ui_action_handler.ts`

Add normal, non-UI shared logic types here:

- `src/version_3/types/*.ts`

## Naming

Use PascalCase for Vue component files and class names:

```ts
NewThingUI
NewThingUIController
NewThingUIPropsBuilder
NewThingUIActionHandler
```

Use snake case for TypeScript file names:

```txt
new_thing_ui_controller.ts
new_thing_ui_props_builder.ts
new_thing_ui_type.ts
```

Use `new_thing_ui` as the controller component name passed to `super(...)`.

## Type Placement

UI component types belong in `src/version_3/ui_types`.

Use this file for:

- Props interfaces.
- Class style interfaces.
- Content payload interfaces.
- State interfaces.
- Computed interfaces.
- Component registry interfaces.
- Action prop interfaces that are specific to that UI component.

General-purpose logic types belong in `src/version_3/types`.

Use this directory for reusable types used by utilities, base classes, API helpers, validators, prop schema helpers, and cross-component business logic.

Do not put UI-specific props or class style contracts in `types`.

## Comments

New classes and methods should have short comments immediately above them. Start each comment with `Method to ...`.

```ts
/* Method to manage NewThingUI state, computed values, and child components. */
class NewThingUIController extends BaseController<...> {
    /* Method to create the controller and initialize the component definition. */
    constructor(props: NewThingUIPropsInterface) {
        super("new_thing_ui", props);
        this.getComponentDefinition();
    }

    /* Method to provide reactive state used by the template. */
    protected getUIStateData(): NewThingUIStateDataInterface {
        return {
            is_loading: false
        };
    }
}
```

Keep comments useful and short. Do not narrate obvious assignments.

## Vue Component File

The Vue file should focus on rendering only. Move state, computed values, watchers, child component registration, and event behavior into the controller and action handler.

Expected pattern:

```vue
<template>
    <div :id="id" :class="class_styles.wrapper_class_style">
        <span :class="class_styles.content_class_style">
            {{ content_props?.label_text }}
        </span>
    </div>
</template>

<script setup lang="ts">
import NewThingUIProps from "../props/new_thing_ui_props";
import NewThingUIController from "../controllers/new_thing_ui_controller";

const props = defineProps(NewThingUIProps);
const controller = new NewThingUIController(props);

const { id, content_props, class_styles } = props;
const { state_refs, computed_refs, action_handler, components } = controller;
</script>
```

Template rules:

- Do not hard-code user-facing text.
- Do not inline Tailwind or CSS classes in templates; use `class_styles`.
- Use props, `content_props`, slots, or `ContentManagerUtil` for content.
- Use controller `computed_refs` for derived display values.
- Use action handler methods for events.
- Use `v-bind="child_props"` when composing existing toolkit components.
- Use slots for intentionally open-ended regions such as modal body, footer, or custom cell content.

## Props File

Runtime Vue props live in `src/version_3/props`. Keep the schema aligned with the props interface using `satisfies Record<keyof ...>`.

```ts
import { PropType } from "vue";

import NewThingUIClassStyles from "../class_styles/new_thing_ui_class_styles";

import {
    NewThingUIClassStylesInterface,
    NewThingUIContentPropsInterface,
    NewThingUIPropsInterface
} from "../ui_types/new_thing_ui_type";

const NewThingUIProps = {
    id: {
        type: String,
        required: true
    },

    content_props: {
        type: Object as PropType<NewThingUIContentPropsInterface>,
        default: () => ({})
    },

    class_styles: {
        type: Object as PropType<NewThingUIClassStylesInterface>,
        default: () => NewThingUIClassStyles
    }
} satisfies Record<keyof NewThingUIPropsInterface, any>;

export default NewThingUIProps;
```

Rules:

- Every prop in `NewThingUIPropsInterface` must exist in the runtime props object.
- Object and array defaults must use factory functions.
- Prefer grouped props such as `content_props`, `boolean_props`, `number_props`, `data_props`, and `action_props` when the component has related options.
- Keep required props minimal. Prefer sensible defaults where possible.

## Props Builder

Every component needs a props builder to make parent-owned reactive props easy to create and update.

Props builders should:

- Extend `BasePropSchema<NewThingUIPropsInterface>`.
- Define `static_prop_keys` for values that should usually not be changed after setup, such as `id`, `type`, `action_props`, `content_props`, and `class_styles`.
- Expose a `configure(...)` method for global defaults.
- Build a complete props object before calling `createReactiveProps(...)`.
- Merge defaults, configured values, and overrides in that order.
- Provide focused update helpers for common dynamic values.

```ts
import BasePropSchema from "../base_classes/base_prop_schema";
import ContentManagerUtil from "../utils/content_manager_util";
import NewThingUIClassStyles from "../class_styles/new_thing_ui_class_styles";

import {
    NewThingUIClassStylesInterface,
    NewThingUIPropsInterface
} from "../ui_types/new_thing_ui_type";

/* Method to build and update reactive NewThingUI props. */
class NewThingUIPropsBuilder extends BasePropSchema<NewThingUIPropsInterface> {
    public static readonly static_prop_keys = [
        "id",
        "action_props",
        "class_styles"
    ] satisfies readonly (keyof NewThingUIPropsInterface)[];

    private static readonly content_manager = ContentManagerUtil.getInstance();

    public static class_styles?: NewThingUIClassStylesInterface;

    /* Method to configure default NewThingUI styles. */
    public static configure(class_styles?: NewThingUIClassStylesInterface): void {
        NewThingUIPropsBuilder.class_styles = class_styles || NewThingUIClassStyles;
    }

    /* Method to build the complete NewThingUI props object. */
    private static buildPropsObject(
        id: string,
        content_key?: string,
        overrides: Partial<NewThingUIPropsInterface> = {}
    ): NewThingUIPropsInterface {
        const label_text = content_key ? (this.content_manager.get<string>(content_key, "") ?? "") : "";

        return {
            id,
            content_props: {
                label_text,
                ...overrides.content_props
            },
            class_styles: {
                ...NewThingUIClassStyles,
                ...(NewThingUIPropsBuilder.class_styles ?? {}),
                ...(overrides.class_styles ?? {})
            }
        };
    }

    /* Method to create reactive NewThingUI props for parent components. */
    public static getReactivePropsObject(
        id: string,
        content_key?: string,
        overrides: Partial<NewThingUIPropsInterface> = {}
    ): NewThingUIPropsInterface {
        return this.createReactiveProps(this.buildPropsObject(id, content_key, overrides));
    }

    /* Method to update the displayed label text. */
    public static updateLabel(props: NewThingUIPropsInterface, label_text: string): NewThingUIPropsInterface {
        return this.updateFlatProps(props, {
            "content_props.label_text": label_text
        });
    }
}

export default NewThingUIPropsBuilder;
```

Use `updateProp` for top-level dynamic values, `updateProps` for multiple top-level values, and `updateFlatProps` for nested values.

## Controller

Controllers own component setup. They should extend `BaseController` and use its lifecycle, state, computed, watcher, component registry, router, route, event bus, and action handler plumbing.

Controllers should:

- Call `super("component_name", props, event_bus?, action_handler?)`.
- Register an action handler when one exists.
- Return child components from `getUIComponents`.
- Return state from `getUIStateData`.
- Return computed getter functions from `getUIComputedData`.
- Return watchers from `getUIWatchers` only when needed.
- Keep side effects in lifecycle methods or action handlers.

```ts
/* Method to manage NewThingUI state and computed data. */
class NewThingUIController extends BaseController<
    NewThingUIPropsInterface,
    NewThingUIStateDataInterface,
    NewThingUIComputedDataInterface,
    NewThingUIComponentsInterface
> {
    public override action_handler: NewThingUIActionHandler;

    /* Method to create the controller and action handler. */
    constructor(props: NewThingUIPropsInterface) {
        super("new_thing_ui", props);

        this.action_handler = new NewThingUIActionHandler(this);
        this.setActionHandler(this.action_handler);

        this.getComponentDefinition();
    }
}
```

## Action Handler

Use an action handler when the component has event logic. Keep event parsing, loading, error handling, async callbacks, and state mutation out of the Vue template.

Action handlers should:

- Extend `BaseActionHandler`.
- Use `invokeAction` to call optional action props.
- Use `runWithLoading` for async operations that need loading state.
- Use `setState`, `getState`, `setErrorMessage`, and `setErrorFromResult` instead of mutating state all over the template.
- Return `Promise<void>` for event handlers.
- Preserve read-only or disabled behavior before invoking user actions.

```ts
/* Method to handle NewThingUI user actions. */
class NewThingUIActionHandler extends BaseActionHandler<
    NewThingUIPropsInterface,
    NewThingUIStateDataInterface,
    NewThingUIComputedDataInterface,
    NewThingUIComponentsInterface
> {
    /* Method to handle the primary click action. */
    public handleOnClick = async (event: MouseEvent): Promise<void> => {
        await this.runWithLoading("is_loading", async () => {
            const result = await this.invokeAction(this.props.action_props?.on_click, event, { props: this.props });
            this.setErrorFromResult(result);
        });
    };
}
```

## Class Styles

All default class strings belong in `src/version_3/class_styles`. Do not place class strings directly in Vue templates, controllers, or action handlers.

```ts
import { NewThingUIClassStylesInterface } from "../ui_types/new_thing_ui_type";

const NewThingUIClassStyles: NewThingUIClassStylesInterface = {
    wrapper_class_style: "",
    content_class_style: ""
};

export default NewThingUIClassStyles;
```

Rules:

- Define every class key used by the Vue file in the class style interface and default object.
- Use `*_class_style` for class string fields.
- Preserve default keys when merging overrides.
- Store child component style overrides as typed nested class styles, for example `button_class_styles?: ButtonUIClassStylesInterface`.

## Content

Do not hard-code user-facing content in components.

Allowed content sources:

- Props, usually through `content_props`.
- Content loaded through `ContentManagerUtil`.
- Slots for caller-owned markup.
- HTML generated by utilities such as `RenderHtmlUtil` from prop builder input.

For content keys, use `ContentManagerUtil.get(...)` or `getWithRecord(...)` in props builders or setup code. Keep fallback strings empty unless a default is truly part of the component behavior.

Do not fetch content directly from inside templates.

## Icons

All icons must be SVG and must live in `src/version_3/resources/svg_icon_resource.ts`.

Use the existing exports:

- `SVGIcons` for direct lookup.
- `SVGIconKey` for typed icon props.
- `getSVGIconValue(icon_key)` when rendering an icon string.

Component type example:

```ts
import { SVGIconKey } from "../resources/svg_icon_resource";

export interface NewThingUIContentPropsInterface {
    icon_key?: SVGIconKey;
}
```

Template example:

```vue
<span
    v-if="content_props?.icon_key"
    :class="class_styles.icon_class_style"
    v-html="getSVGIconValue(content_props.icon_key)"
></span>
```

Do not add inline SVG strings to Vue files, props builders, class styles, or content JSON. Add the SVG to `SVGIcons` and reference it by key.

## Composing Existing Components

When a component uses existing toolkit components, make it easy to plug into them.

Rules:

- Accept child props objects typed from the child component, for example `ButtonUIPropsInterface[]`.
- Render child components with `v-bind`.
- Register child components in the controller `getUIComponents`.
- Let callers override child props rather than hiding all behavior behind booleans.
- Provide builder helpers that accept already-built child props.
- Pass child class style overrides through typed class style fields when useful.

Example:

```ts
export interface NewThingUIPropsInterface {
    action_buttons?: ButtonUIPropsInterface[];
}
```

```vue
<ButtonUI v-for="(button_props, index) in action_buttons" :key="button_props?.id ?? index" v-bind="button_props" />
```

## State, Computed, And Watchers

Use state only for values owned internally by the component. Use props for caller-owned data.

Good state examples:

- `is_loading`
- `error_text`
- `is_dropdown_open`
- Temporary selected values before invoking an action prop

Good computed examples:

- `has_actions`
- `is_disabled`
- `display_items`
- `button_class`

Watcher rules:

- Watch props when internal state must stay in sync with parent-owned values.
- Watch route only when the component must react to navigation.
- Keep watcher handlers small; move complex behavior to private controller methods or an action handler.

## Events And Actions

Prefer typed `action_props` callbacks over ad hoc event emissions for toolkit behavior. Follow existing action prop shapes:

```ts
export interface NewThingUIActionPropsInterface {
    on_click?: (
        event?: MouseEvent,
        config?: { props: NewThingUIPropsInterface }
    ) => Promise<NewThingUIActionMethodReturnInterface | void>;
}
```

Return `{ status, msg, data? }` when the component should update error state. Return `void` when there is nothing to report.

## HTML Rendering

Some existing components use `v-html` because their builders generate icon and text HTML. When adding new rendered HTML:

- Prefer plain interpolation for plain text.
- Use `RenderHtmlUtil` for generated icon/text HTML.
- Keep generated HTML content in `content_props`.
- Never hard-code user-facing text in the template.
- Be careful with caller-provided HTML. Treat it as trusted content only when the caller intentionally owns that markup.

## Verification Checklist

Before finishing a new component:

- The Vue file imports only its props schema, controller, and small rendering helpers such as `getSVGIconValue`.
- The controller initializes through `BaseController`.
- The action handler exists if there are events, async actions, loading behavior, or side effects.
- The props file matches `Record<keyof NewThingUIPropsInterface, any>`.
- The props builder creates complete reactive props and includes update helpers.
- UI component types are in `ui_types`.
- General logic types are in `types`.
- Default classes are all in `class_styles`.
- Icons are SVG keys from `svg_icon_resource.ts`.
- User-facing content comes from props, `ContentManagerUtil`, or slots.
- Comments above new classes and methods start with `Method to ...`.
- Existing components are composed with typed props and `v-bind`.
- `npm run lint` and `npm run typecheck` pass.

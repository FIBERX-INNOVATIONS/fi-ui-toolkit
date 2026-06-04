# FI UI Toolkit

FI UI Toolkit is a Vue 3 component toolkit for building reusable, styled, and configurable interface pieces across Fiberx-style applications.

The current active implementation lives in `version_3`. It is organized around small Vue components, typed props, default class style objects, controllers for derived state, action handlers for user events, and props builders for creating reactive component props.

## What Is Included

- Vue 3 components for buttons, inputs, overlays, modals, navigation, tables, pagination, alerts, loaders, page headers, and layout sections.
- TypeScript interfaces in `src/version_3/ui_types`.
- Vue prop definitions in `src/version_3/props`.
- Default Tailwind-oriented class styles in `src/version_3/class_styles`.
- Controller classes in `src/version_3/controllers`.
- Action handlers in `src/version_3/action_handlers`.
- Reactive props builders in `src/version_3/props_builder`.
- Shared utilities for content, rendering HTML snippets, validation, storage, events, logging, API clients, and formatting.

## Project Shape

```text
src/version_3/
  components/        Vue components and input variants
  props/             defineProps-compatible prop schemas
  props_builder/     helpers for building and updating reactive props
  ui_types/          component, prop, action, computed, and class-style types
  controllers/       component logic and derived state
  action_handlers/   user-event handlers
  class_styles/      default class style objects
  base_classes/      shared controller, action handler, API, and prop schema bases
  utils/             shared helpers
  resources/         global CSS and SVG icon resources
```

## Using A Component

Import components directly from `src/version_3/components` until a package entrypoint is added.

```vue
<template>
    <ButtonUI v-bind="save_button_props" />
</template>

<script setup lang="ts">
import ButtonUI from "./src/src/version_3/components/ButtonUI.vue";
import ButtonUIPropsBuilder from "./src/src/version_3/props_builder/button_ui_props_builder";

const save_button_props = ButtonUIPropsBuilder.getReactivePropsObject("save_btn", "", undefined, "button", {
    content_props: {
        button_html_content: "Save"
    },
    action_props: {
        on_click: async () => {
            return { status: true, msg: "Saved" };
        }
    }
});
</script>
```

## Updating Reactive Props

Props builders return reactive objects. Use builder update helpers when only one value changes.

```ts
ButtonUIPropsBuilder.updateText(save_button_props, "Saving...");
ButtonUIPropsBuilder.setDisabled(save_button_props, true);
```

For inputs:

```ts
import InputUIPropsBuilder from "./src/src/version_3/props_builder/input_ui_props_builder";

const email_input_props = InputUIPropsBuilder.getReactivePropsObject("email", "email", undefined, {
    placeholder_text: "Email address"
});

InputUIPropsBuilder.updateValue(email_input_props, "person@example.com");
InputUIPropsBuilder.updatePlaceholder(email_input_props, "Work email");
InputUIPropsBuilder.setLoading(email_input_props, true);
```

The shared base prop schema also supports patching one or more fields:

```ts
InputUIPropsBuilder.updateProps(email_input_props, {
    helper_text: "Use the email attached to your account"
});

InputUIPropsBuilder.updateFlatProps(email_input_props, {
    "boolean_props.disabled": false
});
```

## Static And Dynamic Props

Builders separate static props from dynamic props.

Static props are values usually configured once, such as `class_styles`, `action_props`, IDs, component type, and handler callbacks. Dynamic props are values expected to change while the UI is live, such as button text, input values, table data, pagination data, loader visibility, alert messages, and selection state.

Static roots are protected by default in the update helpers. If a caller really needs to replace one, pass `allow_static: true`.

```ts
ButtonUIPropsBuilder.updateProps(save_button_props, { class_styles: custom_button_styles }, { allow_static: true });
```

## Styling

Most components accept a `class_styles` object. Each component also has a default class style file in `src/version_3/class_styles`.

```ts
import ButtonUIClassStyles from "./src/src/version_3/class_styles/button_ui_class_styles";

const button_props = ButtonUIPropsBuilder.getReactivePropsObject("primary_btn", "", undefined, "button", {
    content_props: {
        button_html_content: "Continue"
    },
    class_styles: {
        ...ButtonUIClassStyles,
        button_class_style: `${ButtonUIClassStyles.button_class_style} bg-black text-white`
    }
});
```

## Content Keys

Some builders can read copy from `ContentManagerUtil`. Load content once, then pass content keys into builders that support them.

```ts
import ContentManagerUtil from "./src/src/version_3/utils/content_manager_util";

const content_manager = ContentManagerUtil.getInstance();

await content_manager.load("/content.json", "content_resource");
```

## Development

Install dependencies:

```bash
npm install
```

Run linting and type checks:

```bash
npm run lint
```

Fix lintable files:

```bash
npm run lint:fix
```

Format files:

```bash
npm run format
```

Set up the repository git hooks:

```bash
npm run prepare
```

The pre-commit hook runs staged formatting/linting and then `vue-tsc --noEmit`.

## Useful Docs

See [docs/useful.md](./docs/useful.md) for practical recipes and interaction patterns.

## Notes

The package currently points `main` at `app.ts`, but there is no root `app.ts` in the repository. For now, import from `version_3` source paths directly. A future package pass should add a stable entrypoint and export map.

## License

This package is currently marked as `ISC` in `package.json`.

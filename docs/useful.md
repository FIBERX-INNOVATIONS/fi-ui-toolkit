# Useful Toolkit Notes

This guide collects the practical patterns for working with FI UI Toolkit v3 components.

## Import Pattern

Until the package has a stable root export, import the exact component, builder, type, or style object you need from `version_3`.

```ts
import ButtonUI from "../src/src/version_3/components/ButtonUI.vue";
import ButtonUIPropsBuilder from "../src/src/version_3/props_builder/button_ui_props_builder";
import type { ButtonUIPropsInterface } from "../src/src/version_3/ui_types/button_ui_type";
```

## Component Stack

Most v3 components follow this structure:

- `components/*UI.vue`: renders the UI.
- `props/*_props.ts`: Vue `defineProps` schema.
- `ui_types/*_ui_type.ts`: TypeScript contracts.
- `class_styles/*_class_styles.ts`: default classes.
- `controllers/*_controller.ts`: component state, computed values, watchers, and subcomponents.
- `action_handlers/*_action_handler.ts`: event logic.
- `props_builder/*_props_builder.ts`: creates reactive prop objects and updates them safely.

When adding or fixing a component, check these files together. A bug in a component is often caused by a mismatch between prop schema, UI type, controller computed state, and template usage.

## Build Reactive Props

Use props builders when a parent view needs to own and mutate component props.

```ts
import ButtonUIPropsBuilder from "../src/src/version_3/props_builder/button_ui_props_builder";

const submit_button_props = ButtonUIPropsBuilder.getReactivePropsObject("submit_btn", "", undefined, "submit", {
    content_props: {
        button_html_content: "Submit"
    },
    boolean_props: {
        disabled: false
    }
});
```

Render with `v-bind`.

```vue
<ButtonUI v-bind="submit_button_props" />
```

## Update One Prop

Use builder methods instead of rebuilding the whole prop object.

```ts
ButtonUIPropsBuilder.updateText(submit_button_props, "Submitting...");
ButtonUIPropsBuilder.setDisabled(submit_button_props, true);
```

For inputs:

```ts
import InputUIPropsBuilder from "../src/src/version_3/props_builder/input_ui_props_builder";

const search_props = InputUIPropsBuilder.getReactivePropsObject("search", "search", undefined, {
    placeholder_text: "Search records"
});

InputUIPropsBuilder.updateValue(search_props, "invoice");
InputUIPropsBuilder.updatePlaceholder(search_props, "Search by customer or reference");
InputUIPropsBuilder.setLoading(search_props, false);
```

## Update Several Props

Use `updateProps` for top-level props.

```ts
InputUIPropsBuilder.updateProps(search_props, {
    helper_text: "Type at least 3 characters",
    selected_text_prefix: "Selected:"
});
```

Use `updateFlatProps` for nested props.

```ts
InputUIPropsBuilder.updateFlatProps(search_props, {
    "boolean_props.disabled": false,
    "boolean_props.required": true
});
```

If the nested object may not exist, allow missing paths.

```ts
InputUIPropsBuilder.updateFlatProps(
    search_props,
    {
        "boolean_props.is_loading": true
    },
    { create_missing_path: true }
);
```

## Static Props

Props builders declare static roots such as `id`, `class_styles`, `action_props`, `type`, and other configuration values that are usually set once.

Update helpers skip those roots by default. To intentionally update a static root:

```ts
ButtonUIPropsBuilder.updateProps(
    submit_button_props,
    {
        action_props: {
            on_click: async () => ({ status: true, msg: "Updated action" })
        }
    },
    { allow_static: true }
);
```

Use this sparingly. In most cases, mutate dynamic props and leave configured styles/actions alone.

## Common Component Recipes

### Button

```vue
<template>
    <ButtonUI v-bind="delete_button_props" />
</template>

<script setup lang="ts">
import ButtonUI from "../src/src/version_3/components/ButtonUI.vue";
import ButtonUIPropsBuilder from "../src/src/version_3/props_builder/button_ui_props_builder";

const delete_button_props = ButtonUIPropsBuilder.getReactivePropsObject("delete_btn", "", undefined, "button", {
    content_props: {
        button_html_content: "Delete"
    },
    action_props: {
        on_click: async () => {
            ButtonUIPropsBuilder.setDisabled(delete_button_props, true);
            return { status: true, msg: "Deleted" };
        }
    }
});
</script>
```

### Text Input

```vue
<template>
    <BaseInputUI v-bind="name_input_props" />
</template>

<script setup lang="ts">
import BaseInputUI from "../src/src/version_3/components/InputUI/BaseInputUI.vue";
import InputUIPropsBuilder from "../src/src/version_3/props_builder/input_ui_props_builder";

const name_input_props = InputUIPropsBuilder.getReactivePropsObject("full_name", "text", undefined, {
    placeholder_text: "Full name",
    action_props: {
        on_change: async (_event, value) => {
            console.log("name changed", value);
            return { status: true, msg: "" };
        }
    }
});
</script>
```

### Page Header

```ts
import PageHeaderUIPropsBuilder from "../src/src/version_3/props_builder/page_header_ui_props_builder";
import HeaderTextUIPropsBuilder from "../src/src/version_3/props_builder/header_text_ui_props_builder";
import ButtonUIPropsBuilder from "../src/src/version_3/props_builder/button_ui_props_builder";

const header_props = HeaderTextUIPropsBuilder.getReactivePropsObject("h1", "content_resource.pages.dashboard.title");

const refresh_button_props = ButtonUIPropsBuilder.getReactivePropsObject("refresh_btn", "", undefined, "button", {
    content_props: {
        button_html_content: "Refresh"
    }
});

const page_header_props = PageHeaderUIPropsBuilder.getReactivePropsObject(
    header_props,
    [refresh_button_props],
    "content_resource.pages.dashboard.description"
);
```

### Pagination

```ts
import PaginationUIPropsBuilder from "../src/src/version_3/props_builder/pagination_ui_props_builder";

const pagination_props = PaginationUIPropsBuilder.getReactivePropsObject("users_pagination", {
    current_page: 1,
    total_pages: 8
});

PaginationUIPropsBuilder.updateFlatProps(pagination_props, {
    "data_props.current_page": 2
});
```

### Toaster

```ts
import ToasterUIPropsBuilder from "../src/src/version_3/props_builder/toaster_ui_props_builder";

const toast_props = ToasterUIPropsBuilder.getReactivePropsObject("", "info");

ToasterUIPropsBuilder.updateMessage(toast_props, "Saved successfully", "success");
```

## Content Manager

Some builders resolve text from content keys. Load your content object once at application startup.

```ts
import ContentManagerUtil from "../src/src/version_3/utils/content_manager_util";

const content_manager = ContentManagerUtil.getInstance();

await content_manager.load("/content.json", "content_resource");
```

Example `content.json`:

```json
{
    "pages": {
        "dashboard": {
            "title": "Dashboard",
            "description": "A quick look at your account activity."
        }
    }
}
```

Read content:

```ts
const title = content_manager.get<string>("content_resource.pages.dashboard.title", "");
```

Read content with record placeholders:

```ts
const message = content_manager.getWithRecord<string>(
    "content_resource.messages.welcome",
    { user: { name: "Amara" } },
    ""
);
```

## Action Handlers

Action props are passed into component props and consumed by the component action handler.

```ts
const button_props = ButtonUIPropsBuilder.getReactivePropsObject("save", "", undefined, "button", {
    action_props: {
        on_click: async (_event, config) => {
            console.log(config?.props.id);
            return { status: true, msg: "Saved" };
        }
    }
});
```

Return `{ status, msg }` when the component should receive a success/failure result. Return `void` when the action has nothing to report.

## Styling

Default styles live in `src/version_3/class_styles`.

```ts
import ButtonUIClassStyles from "../src/src/version_3/class_styles/button_ui_class_styles";

const button_props = ButtonUIPropsBuilder.getReactivePropsObject("secondary_btn", "", undefined, "button", {
    class_styles: {
        ...ButtonUIClassStyles,
        button_class_style: `${ButtonUIClassStyles.button_class_style} border border-slate-300`
    }
});
```

Prefer overriding only the classes you need. Keep the rest of the default style object intact so required class keys remain available to the component.

## Working On A Component

When improving a component, move in this order:

1. Update `ui_types` first so the contract is clear.
2. Update `props` if Vue runtime props changed.
3. Update `class_styles` if the template expects new class keys.
4. Update the controller for state, computed values, and watchers.
5. Update the action handler for event behavior.
6. Update the Vue component template last.
7. Update the props builder if parent-owned reactive props need a new creation or update path.

## Verification

Run these before committing:

```bash
npm run lint:fix
npm run lint
```

`npm run lint` runs ESLint for v3 files and then `vue-tsc --noEmit`.

## Current Caveats

- The repository does not currently expose a stable package entrypoint, so source-path imports are the reliable option.
- `src/version_3/props_builder` is used by ESLint and formatting, but the current TypeScript project config excludes that directory from `vue-tsc`.
- Some older `version_2` utilities still exist for compatibility or migration reference.

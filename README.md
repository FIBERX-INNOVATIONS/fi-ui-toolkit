# 🚀 FI UI Toolkit

**FI UI Toolkit** is a customizable Vue 3 component library designed to provide reusable, styled, and configurable UI elements across multiple Vue applications. It helps standardize UI structure, simplify development, and promote consistency across your projects.

---

## 📦 Features

- ✅ Built with **Vue 3** and **Composition API**
- 🎨 Styled using **Tailwind CSS**
- 🧩 Fully **modular and reusable** components
- ⚙️ Highly **configurable** via props and scoped controllers
- 📁 Organized into clear categories: Forms, Navigation, Display, Layout, etc.

---

## 🧩 Usage

Import any component into your Vue app:

```js
import TopBarUI from "@ui/Navigation/TopBar/top_bar_ui.vue";

<TopBarUI :config="topBarConfig" />
```

Example config object:

```js
const topBarConfig = {
    background_color: "#f9f9f9",
    height: 92,
    has_shadow: true,
    section_1_component: ImageTextUI,
    section_1_props: {
        text: "My App",
        text_class: "text-lg font-bold",
        image_src: "/logo.png"
    }
};
```

---

## 🧠 Customization

Each component:

- Comes with a dedicated **controller class** to handle logic, configuration defaults, and Vue lifecycle hooks.
- Can be dynamically rendered using `<component :is="...">` patterns.
- Can be extended or overridden for specific use cases.

---

## 💡 Development Tips

- Use `markRaw()` from Vue to pass components via props without reactivity overhead.
- Extend and wrap base components in your apps to preserve core logic and style consistency.
- Use Tailwind utility classes via `class_style` props for custom appearance.

---

## 🤝 Contributing

If you're working in a team or want to extend this:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Submit a pull request

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## 🏢 Maintained by

**Fiberx Innovations**
© 2025 Powered by Fiberx Innovations

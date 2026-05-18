<template>
    <div v-if="visible" :class="class_styles.wrapper_class_style">
        <div :class="class_styles.loader_class_style">
            <div :class="class_styles.loader_symbol_class_style">
                <!-- image loader -->
                <img
                    v-if="loader_symbol?.type === 'img'"
                    :src="loader_symbol?.src"
                    :class="loader_symbol?.class_style || class_styles.loader_symbol_img_class_style"
                    :alt="loader_symbol?.alt_text"
                />
            </div>

            <p v-if="loader_text" :class="class_styles.loader_text_class_style" v-html="loader_text"></p>
        </div>
    </div>
</template>

<script setup lang="ts">
import "../resources/global_styles.css";
import ScreenLoaderUIProps from "../props/screen_loader_ui_props";
import ScreenLoaderUIController from "../controllers/screen_loader_ui_controller";

const props = defineProps(ScreenLoaderUIProps);
new ScreenLoaderUIController(props);

const { visible, class_styles, loader_symbol, loader_text } = props;
</script>

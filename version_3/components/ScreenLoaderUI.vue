<template>
    <div v-if="props.visible" :class="props.class_styles.wrapper_class_style">
            <div :class="props.class_styles.loader_class_style">

                <div :class="props.class_styles.loader_symbol_class_style">
                    <!-- image loader -->
                    <img v-if="props.loader_symbol?.type === 'img'" 
                        :src="props.loader_symbol?.src" 
                        :class="props.loader_symbol?.class_style" 
                        :alt="props.loader_symbol?.alt_text" 
                    />
                </div>

                <p 
                    v-if="props.loader_text" 
                    :class="props.class_styles.loader_text_class_style" 
                    v-html="props.loader_text"
                >
                </p>
            </div>
    </div>
</template>

<script setup lang="ts">
import "../resources/global_styles.css";
import ScreenLoaderUIProps      from "../props/screen_loader_ui_props";
import ScreenLoaderUIController from "../controllers/screen_loader_ui_controller";

const props         = defineProps(ScreenLoaderUIProps);
const controller    = new ScreenLoaderUIController(props)
</script>
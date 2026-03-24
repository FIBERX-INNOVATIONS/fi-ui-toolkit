<template>
    <OverlayUI v-bind="overlay_props">

        <div
            :class="class_styles.wrapper_class_style"
            :style="computed_refs.z_index_style.value"
        >

            <transition
                :name="computed_refs.transition_name.value"
                appear
            >

                <div
                    v-if="state_refs.is_visible"
                    :class="class_styles.modal_class_style"
                >

                    <!-- Header -->
                    <div :class="class_styles.header_class_style">

                        <slot name="header">

                            <div :class="class_styles.header_title_wrapper_class_style">

                                <img
                                    v-if="title_img"
                                    :src="title_img"
                                    :class="class_styles.header_title_img_icon_class_style"
                                />

                                <span
                                    v-else-if="title_icon"
                                    v-html="getSVGIconValue(title_icon)"
                                    :class="class_styles.header_title_img_icon_class_style"
                                ></span>

                            <h3
                                :class="class_styles.header_title_class_style"
                                v-html="title_text"
                            ></h3>

                            </div>

                            <div :class="class_styles.header_close_btn_wrapper_class_style">

                                <button
                                    type="button"
                                    :class="class_styles.close_btn_class_style"
                                    @click="action_handler?.handleClose?.($event)"
                                    v-html="content_props?.close_btn_content ?? getSVGIconValue(content_props?.close_btn_icon_key)"
                                >
                                </button>

                            </div>

                        </slot>

                    </div>


                    <!-- Body -->
                    <div :class="class_styles.body_class_style">
                        <slot name="body" />
                    </div>


                    <!-- Footer -->
                    <div :class="class_styles.footer_class_style">
                        <slot name="footer" />
                    </div>

                </div>

            </transition>

        </div>

    </OverlayUI>
</template>

<script setup lang="ts">

import ModalUIProps from "../props/modal_ui_props";
import ModalUIController from "../controllers/modal_ui_controller";

import { getSVGIconValue } from "../resources/svg_icon_resource";

const props = defineProps(ModalUIProps);

const controller = new ModalUIController(props);

const {
    overlay_props,
    title_text,
    title_icon,
    title_img,
    class_styles,
} = props;

const {
    state_refs,
    computed_refs,
    action_handler,
    components
} = controller;

const {
    LayoutSectionsUI,
    OverlayUI
} = components


</script>
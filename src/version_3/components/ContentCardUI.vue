<template>
    <article :id="id" :class="class_styles.wrapper_class_style">
        <header v-if="has_title" :class="class_styles.header_class_style">
            <h3 :class="class_styles.title_class_style">
                <span
                    v-if="content_props?.title_icon && !title_icon_is_after"
                    :class="class_styles.title_icon_class_style"
                    v-html="getSVGIconValue(content_props.title_icon)"
                ></span>

                <span :class="class_styles.title_text_class_style">
                    {{ content_props?.title_text }}
                </span>

                <span
                    v-if="content_props?.title_icon && title_icon_is_after"
                    :class="class_styles.title_icon_class_style"
                    v-html="getSVGIconValue(content_props.title_icon)"
                ></span>
            </h3>
        </header>

        <figure v-if="has_media" :class="class_styles.media_wrapper_class_style">
            <video
                v-if="is_video_media"
                :src="content_props?.media_link"
                :aria-label="content_props?.media_description_text"
                :controls="boolean_props.video_controls !== false"
                :class="class_styles.media_class_style"
                @loadeddata="action_handler.handleMediaLoad()"
                @error="action_handler.handleMediaError()"
            />

            <img
                v-else
                :src="content_props?.media_link"
                :alt="content_props?.media_description_text || ''"
                :loading="boolean_props.lazy_load === false ? 'eager' : 'lazy'"
                :class="class_styles.media_class_style"
                @load="action_handler.handleMediaLoad()"
                @error="action_handler.handleMediaError()"
            />

            <figcaption v-if="has_media_description" :class="class_styles.media_description_class_style">
                {{ content_props?.media_description_text }}
            </figcaption>
        </figure>

        <section v-if="has_description || has_action || error_text" :class="class_styles.body_class_style">
            <div
                v-if="has_description"
                :class="class_styles.description_class_style"
                v-html="content_props?.description_text"
            ></div>

            <p v-if="error_text" :class="class_styles.error_class_style">
                {{ error_text }}
            </p>

            <div v-if="has_action" :class="class_styles.actions_class_style">
                <button
                    type="button"
                    :disabled="is_action_disabled"
                    :class="action_button_class"
                    @click="action_handler.handleActionClick($event)"
                >
                    <span
                        v-if="content_props?.button_icon"
                        :class="class_styles.button_icon_class_style"
                        v-html="getSVGIconValue(content_props.button_icon)"
                    ></span>

                    <span v-if="content_props?.button_text" :class="class_styles.button_text_class_style">
                        {{ content_props.button_text }}
                    </span>
                </button>
            </div>
        </section>
    </article>
</template>

<script setup lang="ts">
import { getSVGIconValue } from "../resources/svg_icon_resource";

import ContentCardUIProps from "../props/content_card_ui_props";
import ContentCardUIController from "../controllers/content_card_ui_controller";

const props = defineProps(ContentCardUIProps);
const controller = new ContentCardUIController(props);

const { id, content_props, boolean_props, class_styles } = props;

const { state_refs, computed_refs, action_handler } = controller;

const { error_text } = state_refs;

const {
    has_title,
    title_icon_is_after,
    has_media,
    is_video_media,
    has_media_description,
    has_description,
    has_action,
    is_action_disabled,
    action_button_class
} = computed_refs;
</script>

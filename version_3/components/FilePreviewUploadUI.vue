<template>
    <div :class="class_styles.wrapper_class_style">

        <!-- PREVIEW AREA -->
        <div :class="[class_styles.preview_container_class_style, state_refs.preview_files.value.length > 1 ? class_styles.multiple_file_container_class_style : class_styles.single_file_container_class_style]">

            <div
                v-for="(item, index) in state_refs.preview_files.value"
                :key="index"
                :class="[class_styles.file_item_wrapper_class_style]"
            >

                <!-- REMOVE -->
                <div
                    v-if="state_refs.preview_files.value.length > 1" 
                    :class="class_styles.remove_btn_wrapper_class_style"
                    @click="action_handler.handleRemoveFile(index)"
                >
                    <span
                        v-if="state_refs.is_deleting.value?.[index]" 
                        :class="class_styles?.remove_btn_loader_class_style" 
                        v-html="getSVGIconValue('loading_svg_icon')"
                    ></span>

                    <span 
                        v-else
                        :class="class_styles?.remove_file_btn_content_class_style" 
                        v-html="remove_file_btn_content"
                    ></span>
                </div>

                <!-- IMAGE -->
                <img
                    v-if="item.type === 'image'"
                    :src="item.url"
                    class="max-h-[200px]"
                />

                <!-- VIDEO -->
                <video
                    v-else-if="item.type === 'video'"
                    controls
                    :src="item.url"
                    class="max-h-[200px]"
                />

                <!-- DOCUMENT -->
                <iframe
                    v-else-if="item.type === 'document'"
                    :src="item.url"
                    class="w-full h-[200px]"
                />

                <!-- UNKNOWN -->
                <span v-else>Unsupported file</span>

            </div>

            <!-- ADD MORE -->
            <div
                v-if="content_props?.add_more_file_btn_content && multiple"
                :class="class_styles.add_more_wrapper_class_style"
                @click="action_handler.handleAddMore"
            >
                <input
                    ref="file_input_ref"
                    type="file"
                    class="hidden"
                    :multiple="multiple"
                    @change="action_handler.handleOnFileInputChange"
                />

                <span
                    v-if="state_refs.is_adding_more.value" 
                    :class="class_styles?.add_more_file_btn_content_class_style" 
                    v-html="getSVGIconValue('loading_svg_icon')"
                ></span>

                <span 
                    v-else
                    :class="class_styles?.add_more_file_btn_content_class_style" 
                    v-html="content_props?.add_more_file_btn_content"
                ></span>
            </div>

        </div>

        <!-- UPLOAD BUTTON -->
        <div :class="class_styles.bottom_action_wrapper_class_style">

            <ButtonUI
                v-bind="props.upload_button_props"
                :action_props="{ on_click: action_handler.handleFileUpload }"
            />

        </div>

    </div>
</template>

<script setup lang="ts">
import FilePreviewUploadUIProps from "../props/file_preview_upload_ui_props";
import FilePreviewUploadUIController from "../controllers/file_preview_upload_ui_controller";
import { getSVGIconValue } from "../resources/svg_icon_resource";

const props = defineProps(FilePreviewUploadUIProps);

const controller = new FilePreviewUploadUIController(props);

const {
    upload_button_props,
    class_styles,
    multiple,
    content_props
} = props;

console.log(props);

const {
    file_input_ref,
    state_refs,
    action_handler,
    components
} = controller;

const { ButtonUI } = components;

const remove_file_btn_content = content_props?.remove_file_btn_content ?? getSVGIconValue("x_circile_svg_icon");
</script>
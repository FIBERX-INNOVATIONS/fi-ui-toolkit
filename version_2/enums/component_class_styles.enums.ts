
export const ComponentClassStyles = {
    loader_ui: {
        list_loader_ui: {
            wrapper_class_style: "w-full flex flex-col items-center justify-center animate-pulse py-4 px-0",
            bar_class_style: "w-full h-12 my-4 bg-gray-300 rounded-lg shadow"
        },
        screen_loader_ui: {
            wrapper_class_style: "fixed inset-0 flex items-center justify-center overflow-hidden",
            loader_class_style: "flex flex-col items-center space-y-4 animate-fade-in",
            loader_symbol_class_style: "",
            loader_text_class_style: "",

        }
    },
    alert_ui: {
        status_alert_ui: {
            wrapper_class_style: "fixed inset-0 flex items-start justify-end overflow-hidden",
            alert_box_class_style: "relative top-6 right-6 max-w-sm w-full flex items-stretch rounded-lg shadow-lg animate-slide-in",
            close_btn_class_style: "absolute -top-3 -left-3 w-8 h-8 flex items-center text-center rounded-full shadow-md cursor-pointer",
            status_icon_wrapper_class_style: "flex items-center justify-center w-2/12  h-full p-2",
            status_icon_class_style: "w-full font-bold",
            status_content_wrapper_class_style: "flex-1 w-10/12 h-full p-4",
            status_content_class_style: "text-sm font-medium"
        },
        toast_alert_ui: {
            wrapper_class_style: "w-full flex items-stretch justify-start border-l-4",
            icon_wrapper_class_style: "flex items-center justify-center w-1/12 p-1",
            icon_class_style: "flex items-center justify-center w-6 h-6",
            message_class_style: "flex-1 w-11/12 h-full p-2"
        }
    },
    copy_right_ui: {
        wrapper_class_style: "w-full text-center py-4",
        text_class_style: ""
    },
    input_ui: {
        input_class_style: "w-full py-2 px-1",
        wrapper_class_style: "flex gap-2 justify-center",
        loader_class_style: "",
        switch_btn_class_style: "group inline-flex h-6 w-11 transition",
        knob_class_style: "size-4 rounded-full transition transform",
        label_text_class_style: "ms-3",
        active_class_style: "bg-blue-300",
        inactive_class_style: "bg-gray-900",
        caret_icon_class: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer",
        dropdown_wrapper_class_style: "absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto",
        options_wrapper_class_style: "",
        option_class_style: "px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm",
        option_content_class_style: ""
    },
    input_group_ui: {
        wrapper_class_style: "w-full my-4",
        label_class_style: "text-sm font-bold",
        label_required_class_style: "italic font-medium",
    },
    button_ui: {
        btn_class_style: "w-full cursor-pointer"
    },
    modal_ui: {
        overlay_class_style: "fixed inset-0 flex justify-center items-center",
        modal_position_class_style: "",
        modal_size_class_style: "",
        modal_box_class_style: "overflow-hidden relative",
        header_wrapper_class_style: "flex w-full items-center jsutfiy-between",
        header_title_content_class_style: "",
        header_title_class_style: "",
        header_close_btn_content_class_style: "",
        close_btn_class_style: "",
        body_class_style: "flex-1",
        left_modal_position_class_style: "fixed left-0 top-0 h-full",
        right_modal_position_class_style: "fixed right-0 top-0 h-full",
        center_modal_position_class_style: "relative mx-auto my-auto"
    },
    img_avatar_ui: {
        wrapper_class_style: "w-full flex items-center h-full",
        avatar_circle_class_style: "flex items-center rounded-full overflow-hidden",
        img_class_style: "w-full h-auto object-cover",
        initials_class_style: "uppercase",
        right_slot_class_style: "flex items-center"

    },
    image_text_ui: {
        wrapper_class_style: "w-full h-full flex items-center justify-center space-x-2",
        img_wrapper_class_style: "w-full h-auto flex items-center justify-center p-0 m-0",
        img_class_style: "object-contian",
        text_class_style: "text-md text-start font-bold",

    },
    search_field_ui: {
        wrapper_class_style: "w-full my-4",
        label_class_style: "text-sm font-bold",
        label_required_class_style: "italic font-medium",
        search_wrapper_class_style: "",
        btn_wrapper_class_style: "",
        input_wrapper_class_style: ""
    },
    navigation_ui: {
        top_bar_ui: {
            wrapper_class_style: "w-screen px-4 flex flex-wrap items-center justify-between relative h-full",
            section_1_wrapper_class_style: "md:w-3/12 w-6/12 flex items-center overflow-hidde h-full",
            section_2_wrapper_class_style: "md:w-6/12 w-full flex items-center overflow-hidden md:order-1 order-2 h-full",
            section_3_wrapper_class_style: "md:w-3/12 w-6/12 flex items-center  md:order-2 order-1 h-full"
        },
        nav_link_ui: {
            wrapper_class_style: "flex items-center cursor-pointer",
            active_menu_class_style: "",
            icon_img_wrapper_class_style: "flex items-center justify-center overflow-hidden",
            icon_img_class_style: "w-full h-auto object-cover",
            content_class_style: "flex items-center"
        },
        menu_list_ui: {
            wrapper_class_style: "hidden divide-y divide-gray-100",
            list_class_style: "py-2",
            list_item_class_style: ""
        },
        modal_sidebar_ui: {
            wrapper_class_style: "fixed inset-0 z-[90]",
            sidebar_class_style: "fixed top-0 h-screen transition-all duration-[2000s] ease-in-out",
            section_1_wrapper_class_style: "h-[15%] flex items-center justify-center",
            section_2_wrapper_class_style: "h-[85%] overflow-y-auto"
        },
        bread_crumb_ui: {
            wrapper_class_style: "w-full flex",
            list_class_style: "inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse w-full",
            list_item_class_style: "inline-flex items-center",
            divider_class_style: "px-2 text-gray-400",
        },
        pagination_ui: {
            wrapper_class_style: "flex items-center space-x-2 w-full",
            prev_button_class_style: "",
            next_button_class_style: "",
            disabled_class_style: "disabled:to-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed border-1",
            select_class_style: "border h-[38px] w-[150px] m-0 bg-gray-100 text-center"
        }
    },
    table_ui: {
        sortable_header_cell_ui: {
            wrapper_class_style: "flex items-center gap-2",
            icon_class_style: "w-3 h-3 cursor-pointer",
            content_wrapper_class_style: "flex space-x-2 items-center justify-center"
        },
        table_header_ui: {
            wrapper_class_style: "bg-gray-100 text-left",
            header_row_class_style: "",
            header_cell_class_style: "",
            selected_checkbox_class_style: "",
        },
        table_body_ui: {
            wrapper_class_style: "group/body divide-y divide-border border-black",
            body_row_class_style: "group/row text-sm",
            body_cell_class_style: "px-4 py-3 whitespace-nowrap border-b border-black text-sm",
            selected_checkbox_class_style: ""
        },
        data_table_ui: {
            wrapper_class_style: "w-full h-full min-h-[400px] block",
            table_class_style: "min-w-full border-collapse border border-gray-300",
            lg_table_wrapper_class_style: "'w-full relative min-h-[500px]",
            
        }
    },
    confirm_action_ui: {
        wrapper_class_style: "w-full flex flex-col justify-center items-center py-8 px-[5%]",
        content_text_wrapper_class_style: "w-full flex items-center my-2",
        content_class_style: "w-full uppercase font-black text-red-900",
        action_btn_wrapper_class_style: "w-full flex items-center my-2 justify-between",
        cancel_action_btn_ui: {
            icon_class_style: "w-4 h-4 ml-2 flex items-center",
            content_class_style: "",
            btn_class_style: "w-full cursor-pointer inline-flex mt-4 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed h-10 px-4 py-3 text-md font-medium transition-colors",
        },
        confirm_action_btn_ui: {
            icon_class_style: "w-4 h-4 ml-2 flex items-center",
            content_class_style: "",
            btn_class_style: "w-full  cursor-pointer inline-flex mt-4 items-center justify-center rounded-lg ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 bg-gradient-to-r from-blue-500 to-blue-900 hover:from-blue-500 hover:to-blue-400 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed text-md text-white font-semibold tracking-wider py-3",
        }
    },
    masked_reveal_ui: {
        wrapper_class_style: "bg-white p-0 rounded-xl flex items-center justify-center border shadow-sm space-y-3 w-full relative oveflow-hidden min-h-[48px]",
        secret_data_input_wrapper_class_style: "relative flex items-center w-8/12 overflow-hidden h-[48px] p-0 m-0",
        secret_data_input_class_style: "flex-1 px-3 py-2 bg-gray-100 w-full h-full rounded-l-xl",
        action_btn_wrapper_class_style: "relative flex items-center w-4/12 overflow-hidden h-[48px] p-0 m-0",
        reveal_btn_class_style: "w-6/12 cursor-pointer flex flex-col items-center justify-center h-full border hover:bg-gray-200",
        reveal_btn_text_class_style: "text-sm font-bold capitalize",
        reveal_btn_icon_class_style: "w-4 h-4 flex items-center justify-center",
        copy_btn_class_style: "w-6/12 cursor-pointer flex flex-col items-center justify-center h-full border hover:bg-gray-200 rounded-r-xl",
        copy_btn_text_class_style: "text-md font-bold capitalize",
        copy_btn_icon_class_style: "w-4 h-4 flex items-center justify-center"

    },
    activity_list_ui: {
        wrapper_class_style: "w-full block items-center justify-center my-4",
        activity_wrapper_class_style: "w-full h-auto block border-2 rounded p-0 my-2",
        activity_header_class_style: "w-full h-[25px] p-2 border-b-4 shadow flex items-center justify-between bg-gray-300",
        activity_header_section_1_class_style: "font-bold text-sm truncate",
        activity_header_section_2_class_style: "font-bold text-sm truncate",
        activity_body_class_style: "w-full p-2 bg-white text-center break-words whitespace-normal",
        activtiy_body_content_class_style: "uppercase text-xs font-bold block",
        select_checkbox_wrapper_class_style: "flex items-center mr-2",
        select_checkbox_class_style: "cursor-pointer h-4 w-4"
    }
}
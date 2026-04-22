export interface ValidationResultInterface<T = any> {
    v_state: boolean;
    v_msg: string;
    v_data?: T
}
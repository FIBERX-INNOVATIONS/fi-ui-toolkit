import { AxiosRequestConfig } from "axios";

import { 
    APIRequestConfig,
    APIResponseInterface 
} from "../types/api_util_type";

import APIClient from "../api_utils/api_client_util";


class BaseAPIService {

    protected static async queryAPI<T>(
        config: APIRequestConfig
    ): Promise<APIResponseInterface<T>> {

        try {
            const axios_instance = APIClient?.getInstance()?.axios_instance;
            const response = await axios_instance.request<T>(config);

            const status_code           = response?.status;
            const { status, msg, data } = response.data as any;

            return {
                status,
                msg,
                data,
                full_response: response
            };

        } catch (error: any) {
            const status_code   = error?.response?.status;

            const msg =
                error?.response?.data?.msg ||
                error?.msg ||
                "invalid_request";

            return {
                status: "error",
                msg,
                full_response: error?.response
            };

        }

    }

}

export default BaseAPIService;
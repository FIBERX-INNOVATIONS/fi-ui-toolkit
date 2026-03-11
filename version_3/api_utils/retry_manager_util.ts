
import { 
    RefreshTokenHandlerType,
    RefreshCSRFHandlerType
} from "@ui_v3/types/api_util_type";

class RetryManagerUtil {

    private static refresh_token_handler?: RefreshTokenHandlerType;

    private static refresh_csrf_handler?: RefreshCSRFHandlerType;

    public static registerRefreshTokenHandler(
        handler: RefreshTokenHandlerType
    ) {
        this.refresh_token_handler = handler;
    }

    public static registerCSRFHandler(
        handler: RefreshCSRFHandlerType
    ) {
        this.refresh_csrf_handler = handler;
    }

    public static async tryRefreshToken(): Promise<boolean> {

        if (!this.refresh_token_handler) return false;

        return await this.refresh_token_handler();

    }

    public static async tryRefreshCSRF(): Promise<boolean> {

        if (!this.refresh_csrf_handler) return false;

        return await this.refresh_csrf_handler();

    }

}

export default RetryManagerUtil;
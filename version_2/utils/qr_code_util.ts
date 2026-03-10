// qr_code_util.ts
import QRCode from "qrcode";

import { QRCodeOptions } from "../../version_3/types/util_type"

class QRCodeUtil {
    public static readonly name = "qr_code_util";

    /**
     * Generates a QR Code as a Data URL (base64 PNG)
     * @param text - The text/URL to encode into a QR Code
     * @param options - Optional QR generation config
     * @returns Promise<string> - base64 PNG as data URL
     */
    public static async generateDataUrl(
        text: string,
        options: QRCodeOptions = {}
    ): Promise<string> {
        if (!text || typeof text !== "string") { return "" }

        try {
            return await QRCode.toDataURL(text, {
                errorCorrectionLevel: "M",
                margin: 2,
                width: 300,
                ...options,
            });
        } catch (error: any) {
            console.error("QRCodeUtil.generateDataUrl error:", error);
            throw new Error("Failed to generate QR code image.");
        }
    }

    /**
     * Generates a QR Code as a base64 PNG buffer (Node-friendly)
     * @param text - The text/URL to encode into a QR Code
     * @param options - Optional QR generation config
     * @returns Promise<Buffer>
     */
    public static async generateBuffer(
        text: string,
        options: QRCodeOptions = {}
    ): Promise<Buffer> {
        if (!text || typeof text !== "string") {
            throw new Error("QRCodeUtil.generateBuffer: input text must be a valid string.");
        }

        try {
            return await QRCode.toBuffer(text, {
                errorCorrectionLevel: "M",
                margin: 2,
                width: 300,
                ...options,
            });
        } catch (error: any) {
            console.error("QRCodeUtil.generateBuffer error:", error);
            throw new Error("Failed to generate QR code buffer.");
        }
    }
}

export default QRCodeUtil;

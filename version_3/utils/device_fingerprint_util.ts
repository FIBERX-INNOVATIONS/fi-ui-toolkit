/* eslint-disable @typescript-eslint/no-explicit-any */
class DeviceFingerprintUtil {
    // Method to generate device fingerprint (Frontend only)
    public static generateFingerprint(): string | null {
        try {
            if (typeof window === "undefined" || typeof navigator === "undefined") {
                console.warn("DeviceFingerprintUtil.generateFingerprint: Not running in a browser context.");
                return null;
            }

            const navigator_info = window.navigator;
            const screen_info = window.screen;

            const data: (string | number)[] = [
                navigator_info.userAgent,
                navigator_info.language,
                navigator_info.platform,
                screen_info.height,
                screen_info.width,
                screen_info.colorDepth,
                new Date().getTimezoneOffset(),
                window.devicePixelRatio ?? 1,
                this.getCanvasFingerprint(),
            ];

            const raw_string = data.join("###");
            return this.hashString(raw_string);
        } catch (error) {
            console.error("Error generating fingerprint:", error);
            return null;
        }
    }

    // Method to validate fingerprint on the server (Backend)
    public static validateFingerprint(client_fingerprint: string, known_fingerprint: string): boolean {
        return client_fingerprint === known_fingerprint;
    }

    // Method to detect fingerprint changes (Backend)
    public static hasFingerprintChanged(old_fingerprint: string, new_fingerprint: string): boolean {
        return old_fingerprint !== new_fingerprint;
    }

    // Lightweight hash function (non-cryptographic)
    public static hashString(str: string): string {
        let hash = 0;
        if (!str.length) return "fp_0";

        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convert to 32bit integer
        }

        return `fp_${Math.abs(hash)}`;
    }

    // Generate a canvas-based fingerprint (Frontend only)
    private static getCanvasFingerprint(): string {
        try {
            if (typeof document === "undefined") {
                return "";
            }

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) return "";

            ctx.textBaseline = "top";
            ctx.font = "16px Arial";
            ctx.fillStyle = "#f60";
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = "#069";
            ctx.fillText("Fingerprint!", 2, 15);
            ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
            ctx.fillText("Fingerprint!", 4, 17);

            return canvas.toDataURL("image/png");
        } catch {
            console.warn("Canvas fingerprinting not supported");
            return "";
        }
    }

    // Best guess of human-readable device name
    public static getDeviceName(): string {
        if (typeof navigator === "undefined") return "Unknown Device";
        const ua = navigator.userAgent;

        if (/windows phone/i.test(ua)) return "Windows Phone";
        if (/android/i.test(ua)) return /mobile/i.test(ua) ? "Android Phone" : "Android Tablet";
        if (/iPad|Macintosh/i.test(ua) && typeof document !== "undefined" && "ontouchend" in document)
            return "iPad";
        if (/iPhone/i.test(ua)) return "iPhone";
        if (/Macintosh/i.test(ua)) return "Mac";
        if (/Windows NT/i.test(ua)) return "Windows PC";
        if (/Linux/i.test(ua)) return "Linux";

        return "Unknown Device";
    }

    // Optional: Static helper to get everything at once
    public static getDeviceInfo(): {
        device_id: string | null;
        device_name: string;
        user_agent: string;
    } {
        return {
            device_id: this.generateFingerprint(),
            device_name: this.getDeviceName(),
            user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
        };
    }
}

export default DeviceFingerprintUtil;

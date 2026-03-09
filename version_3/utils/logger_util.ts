import { LoggerType, LoggerOptions }    from "../types/util_type";

class LoggerUtil {
    private prefix: string;
    private show_timestamp: boolean;
    private visible_log_types: string[];

    constructor({ prefix = '', show_timestamp = false }: LoggerOptions = {}) {
        this.prefix             = prefix;
        this.show_timestamp     = show_timestamp;

        this.visible_log_types  = ["error", "warn", "debug"];
    }

    // Main logger
    private _log(type: LoggerType, color: string, ...args: unknown[]): void {
        const time              = this.show_timestamp ? `[${new Date().toISOString()}]` : '';
        const prefix            = this.prefix ? `%c[${this.prefix}]` : '';
        const base_style        = `color: ${color}; font-weight: bold;`;
        const is_visible_type   = this.visible_log_types.includes(type);

        if (prefix && is_visible_type) {
            console[type](`${time} ${prefix}`, base_style, ...args);
        } 
        else if (is_visible_type) {
            console[type](`${time} ${prefix}`, base_style, ...args);
        }
    }

    log (...args: any[]): void { this._log('log', '#3498db', ...args); } 

    info (...args: any[]): void { this._log('info', '#2ecc71', ...args); }

    warn (...args: any[]): void { this._log('warn', '#f1c40f', ...args); }

    error (...args: any[]): void { this._log('error', '#e74c3c', ...args); }

    debug (...args: any[]): void { this._log('debug', '#9b59b6', ...args); }
}

export default LoggerUtil;

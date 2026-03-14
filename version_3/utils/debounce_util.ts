// src/utils/debounce_util.ts
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function debounceMethod<T extends (...args: any[]) => any>(
    func: T,
    delay = 300
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
    let timer: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
        return new Promise((resolve) => {
            if (timer) clearTimeout(timer);

            timer = setTimeout(async () => {
                try {
                    const result = await func(...args);
                    resolve(result);
                } catch (error) {
                    // Propagate errors to the caller
                    throw error;
                }
            }, delay);
        });
    };
}

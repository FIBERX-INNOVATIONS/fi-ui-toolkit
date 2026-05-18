import mitt, { Emitter } from "mitt";

/**
 * Creates a typed event bus with the given event map type.
 *
 * @example
 * type MyEvents = {
 *   login: { userId: string };
 *   logout: void;
 * };
 *
 * const bus = createEventBus<MyEvents>();
 * bus.emit("login", { userId: "123" });
 */
export function createEventBus<T extends Record<string, any>>(): Emitter<T> {
    return mitt<T>();
}

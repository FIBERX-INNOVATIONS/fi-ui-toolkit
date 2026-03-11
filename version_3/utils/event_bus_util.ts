// toolkit/event_bus.ts

import mitt, { Emitter } from "mitt";

export function createEventBus<T extends Record<string, any>>() {
    return mitt<T>();
}

export type EventBusType<T extends Record<string, any>> = Emitter<T>;
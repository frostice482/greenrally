export default class TypedEventTarget<T extends Record<string, any>> extends EventTarget {
    addEventListener<K extends Extract<keyof T, string>, F extends Listener<T[K]> | null>(type: K, callback: F, options?: boolean | AddEventListenerOptions) {
        super.addEventListener(type, callback as never, options)
        return callback
    }

    declare removeEventListener: <K extends keyof T>(type: K, callback: Listener<T[K]> | null, options?: boolean | EventListenerOptions) => void

    emit<K extends Extract<keyof T, string>>(type: K, data: T[K], options?: T[K] extends Event ? never : EventInit) {
        let ev = data as any

        // data type is event
        if (ev instanceof Event) {
            if (ev.type !== type) console.warn('Dispatching event type', ev.type, 'while expecting', type, '-', ev)
            return super.dispatchEvent(ev)
        }

        // data type is not event
        return super.dispatchEvent(new CustomEvent(type, { ...options, detail: data }))
    }
}

type ListenerData<T> = T extends Event ? T : CustomEvent<T>
type Listener<T> = { (data: ListenerData<T>): void } | { handleEvent(data: ListenerData<T>): void }

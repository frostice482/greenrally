export class ResizeListenerMap {
    list = new WeakMap<Element, Set<ResizeListener>>()
    observer = new ResizeObserver(entries => {
        for (const entry of entries) {
            const listeners = this.list.get(entry.target)
            if (!listeners) continue

            for (const listener of listeners) listener(entry)
        }
    })

    listen(element: Element, fn: ResizeListener) {
        let set = this.list.get(element)
        if (!set) {
            this.list.set(element, set = new Set)
            this.observer.observe(element)
        }
        set.add(fn)
    }

    unlisten(element: Element, fn: ResizeListener) {
        const set = this.list.get(element)
        if (!set) return

        set.delete(fn)
        if (set.size === 0) {
            this.list.delete(element)
            this.observer.unobserve(element)
        }
    }

    unlistenAll(element: Element) {
        this.list.delete(element)
        this.observer.unobserve(element)
    }

    clear() {
        this.list = new WeakMap
        this.observer.disconnect()
    }
}

const resizeListener = new ResizeListenerMap()
export default resizeListener

type ResizeListener = (entry: ResizeObserverEntry) => void
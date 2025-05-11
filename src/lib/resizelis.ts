export class ResizeObserverMap {
    list = new WeakMap<Element, Set<ResizeCallback>>
    observer = new ResizeObserver(entries => {
        for (const entry of entries) {
            const listeners = this.list.get(entry.target)
            if (listeners) for (const fn of listeners) fn(entry)
        }
    })

    listen(key: Element, value: ResizeCallback) {
        let set = this.list.get(key)
        if (!set) {
            this.list.set(key, set = new Set)
            this.observer.observe(key)
        }
        set.add(value)
    }

    unlisten(key: Element, value?: ResizeCallback) {
        let set = this.list.get(key)
        if (!set) return

        if (!value || set.delete(value) && set.size === 0) {
            this.list.delete(key)
            this.observer.unobserve(key)
        }
    }

    clear() {
        this.observer.disconnect()
        this.list = new WeakMap
    }
}

type ResizeCallback = (entry: ResizeObserverEntry) => void

const resizeListener = new ResizeObserverMap
export default resizeListener

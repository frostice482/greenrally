export default abstract class JSONStore<T> {
    constructor(storage: Storage, property: string) {
        this.storage = storage
        this.property = property
    }

    storage: Storage
    property: string

    save() {
        this.storage.setItem(this.property, JSON.stringify(this.toJSON()))
    }

    load() {
        const str = this.storage.getItem(this.property)
        if (!str) return
        const json = JSON.parse(str) as T
        this.loadJSON(json)
        return json
    }

    abstract loadJSON(data: T): void

    abstract toJSON(): T
}
import { nodeState } from "lib/state";
import BComp from "./bcomp";
import Hook from "./hook";

function compareMap(a: Map<any, any>, b: Map<any, any>) {
    if (a.size !== b.size) return true

    const a_leftovers = new Set(a.keys())
    for (const [bk, bv] of b) {
        const av = a.get(bk)
        if (av !== bv) return true
        a_leftovers.delete(bk)
    }

    if (a_leftovers.size) return true
    return false
}

const emptyMap =  new Map<any, any>

export default abstract class BCompState<T = any> extends BComp<T> {
    constructor(arg: T) {
        super(arg as any)
        this.node(this.hook)
    }

    protected oldState = emptyMap
    protected internalNode = nodeState()
    protected hook = <Hook onConnect={() => this.render()} onMove={() => this.render()}>{this.internalNode()}</Hook>

    abstract getState(): object | Map<any, any>

    protected updateState() {
        const oldState = this.oldState
        const nsRaw = this.getState()
        const newState = this.oldState = nsRaw instanceof Map ? nsRaw : new Map(Object.entries(nsRaw))
        return compareMap(oldState, newState)
    }

    render(rerender = false) {
        const updated = this.updateState()
        if (!this.rendered || rerender || updated) {
            this.internalNode(this.makeNode())
        }
        this.rendered = true
        return this.hook
    }
}
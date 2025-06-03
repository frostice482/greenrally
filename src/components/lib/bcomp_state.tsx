import { nodeState } from "lib/state";
import BComp from "./bcomp";
import Hook from "./hook";
import { CustomHTMLElement } from "lib/custom_elm";

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
    protected oldState = emptyMap
    protected internalNode = nodeState()

    protected abstract getState(): object | Map<any, any>

    protected makeHook() {
        return <Hook onConnect={() => this.render()} onMove={() => this.render()}>{this.internalNode()}</Hook>
    }

    protected updateState() {
        const oldState = this.oldState
        const nsRaw = this.getState()
        const newState = this.oldState = nsRaw instanceof Map ? nsRaw : new Map(Object.entries(nsRaw))
        return compareMap(oldState, newState)
    }

    render(rerender = false) {
        const updated = this.updateState()
        if (!this.rendered || rerender || updated) {
            const n = this.makeNode()
            if (n instanceof CustomHTMLElement) {
                this.node(n)
            }
            else {
                this.internalNode(n)
                this.node(this.makeHook())
            }
        }
        this.rendered = true
        return this.node()
    }
}
import { Component, ReactElement } from "jsx-dom";
import { nodeState } from "lib/state";

export default abstract class BComp<T = any> extends Component<T> {
    node = nodeState<ReactElement>()

    protected abstract makeNode(): ReactElement
    rendered = false

    render(rerender = false) {
        if (!this.rendered || rerender) this.node(this.makeNode())
        this.rendered = true
        return this.node()
    }
}
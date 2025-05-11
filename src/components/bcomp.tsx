import { Component, ReactElement } from "jsx-dom";

export default abstract class BComp<T = {}> extends Component<T> {
    abstract node: ReactElement

    protected beforeRender() {}

    protected abstract makeNode(): ReactElement

    abstract render(): ReactElement
}
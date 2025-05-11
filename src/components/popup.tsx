import { ReactElement } from "jsx-dom"
import { nodeState } from "lib/state"

export default class Popup {
    constructor(children: ReactElement, opts: PopupOpts = {}) {
        const node = <div class="popup">{this.children(children)}</div> as HTMLElement
        this.node = node

        this.clickOutHide = opts.clickOutHide ?? true
        this.hoverOutHide = opts.hoverOutHide ?? false
        this.clickFocus = opts.clickFocus ?? true

        if (opts.blur) node.classList.add("blur")
        if (!opts.blockBackground) node.classList.add("ghostlayer")

        children.addEventListener("click", () => this.handleOnClick())
        children.addEventListener("click", () => this.handleOnHoverOut())
    }

    protected handleOnClick() {
        this._clicked = true
        this.focusCurrent = this.clickFocus
    }

    protected handleOnDocumentClick() {
        if (this._clicked)
            this._clicked = false
        else
            this.hide()
    }

    protected handleOnHoverOut() {
        if (this.hoverOutHide && !this.clickFocus)
            this.hide()
    }

    clickOutHide: boolean
    hoverOutHide: boolean
    clickFocus: boolean
    focusCurrent = false

    protected _clicked = false
    protected _abort?: AbortController
    get shown() { return Boolean(this._abort && !this._abort.signal.aborted) }

    children = nodeState()
    node: HTMLElement

    show() {
        if (this.shown) return

        this._abort = new AbortController
        const sig = this._abort.signal

        document.addEventListener("click", () => this.handleOnDocumentClick(), { signal: sig })
        this.node.hidden = false
    }

    hide() {
        if (!this.shown) return

        this._abort?.abort()
        this.node.hidden = true
    }
}

export interface PopupOpts {
    clickOutHide?: boolean // true
    hoverOutHide?: boolean // false
    clickFocus?: boolean // true
    blur?: boolean // false
    blockBackground?: boolean // false
}
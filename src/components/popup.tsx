import { Component, ReactElement } from "jsx-dom";

export default class CPopup extends Component<CPopupOpts> {
    constructor(props: CPopupOpts) {
        super(props)
        this.clickOutHide = props.clickOutHide ?? true
        this.hoverOutHide = props.hoverOutHide ?? false
        this.clickFocus = props.clickFocus ?? true

        this.node = <div class="popup">
            {props.children}
        </div>

        if (props.blur) this.node.classList.add("blur")
        if (!props.blockBackground) this.node.classList.add("ghostlayer")

    }

    clickOutHide: boolean
    hoverOutHide: boolean
    clickFocus: boolean
    focusCurrent = false

    protected _shown = false
    get shown() { return this._shown }

    node: ReactElement

    show() {
    }

    hide() {
    }
}

export interface CPopupOpts {
    clickOutHide?: boolean // true
    hoverOutHide?: boolean // false
    clickFocus?: boolean // true
    blur?: boolean // false
    blockBackground?: boolean // false
    children?: any
}
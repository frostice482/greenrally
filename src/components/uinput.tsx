import { textState } from "lib/state"

export default class UInput {
    constructor(input: Node, fieldName = "") {
        this.fieldName(fieldName)
        this.input = input as HTMLInputElement
        this.node = this.makeNode()

        this.input.addEventListener("focus", () => {
            this.resetError()
        })
        this.input.addEventListener("blur", () => {
            if (!this.input.checkValidity()) this.setError(this.input.validationMessage, true)
        })
    }

    errorText = textState(" ")
    fieldName = textState()
    input: HTMLInputElement
    node

    setError(text: string, isDefault = false) {
        this.errorText(text)
        if (!isDefault) this.input.setCustomValidity(text)
        this.node.classList.add("invalid")
    }

    resetError() {
        this.errorText(" ")
        this.input.setCustomValidity("")
        this.node.classList.remove("invalid")
    }

    protected makeNode() {
        return <div class="uinput flex-col fill-x">
            <small>{this.fieldName()}</small>
            {this.input}
            <small>{this.errorText()}</small>
        </div>
    }

    render() {
        return this.node
    }
}

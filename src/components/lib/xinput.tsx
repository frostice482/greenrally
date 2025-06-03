import { ReactElement } from "jsx-dom";
import { nodeState, textState } from "lib/state";

export default class XInput {
    constructor(input: Element, fieldName = '', customValidation?: XCustomValidation) {
        this.input = input as E.input
        this.fieldName = fieldName
        this.customValidation = customValidation
        this.node(this.makeContainer())
        input.addEventListener('input', () => this.clearError())
        input.addEventListener('blur', () => this.update())
    }

    errorText = textState()
    input: E.input
    fieldName: string
    node = nodeState<ReactElement>()

    customValidation?: XCustomValidation

    clearError() {
        this.node().classList.remove('error')
        this.errorText('')
    }

    setError(error = this.input.validationMessage) {
        if (!error) return
        this.node().classList.add('error')
        this.errorText(error)
    }

    update(error?: string | void) {
        this.clearError()
        this.input.setCustomValidity(error ?? this.customValidation?.(this.input.value) ?? '')
        this.setError()
    }

    protected makeContainer() {
        return <div class="xinput">
            <span>{this.fieldName ?? this.input.name}</span>
            {this.input}
            <small>{this.errorText()}</small>
        </div>
    }
}

export type XCustomValidation = (value: string) => string | void | undefined
export interface CustomElementHandler {
    /**
     * Called each time the element is added to the document
     * The specification recommends that, as far as possible,
     * developers should implement custom element setup in this callback rather than the constructor.
     */
    connectedCallback(): void
    /**
     * Called each time the element is removed from the document.
     */
    disconnectedCallback(): void
    /**
     * When defined, this is called instead of `connectedCallback()` and `disconnectedCallback()`
     * each time the element is moved to a different place in the DOM via Element.moveBefore().
     * Use this to avoid running initialization/cleanup code in the `connectedCallback()` and `disconnectedCallback()` callbacks
     * when the element is not actually being added to or removed from the DOM.
     * See [Lifecycle callbacks and state-preserving moves](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#lifecycle_callbacks_and_state-preserving_moves) for more details.
     */
    connectedMoveCallback(): void
    /**
     * Called each time the element is moved to a new document
     */
    adoptedCallback(): void
    /**
     * Called when attributes are changed, added, removed, or replaced.
     * See [Responding to attribute changes](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes) for more details about this callback.
     */
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void
}

export class CustomHTMLElement extends HTMLElement implements CustomElementHandler {
    connectedCallback() {
        this.onConnect?.()
    }
    disconnectedCallback() {
        this.onDisconnect?.()
    }
    connectedMoveCallback() {
        this.onMove?.()
    }
    adoptedCallback() {
        this.onAdopted?.()
    }
    attributeChangedCallback(a: string, b: string, c: string) {
        this.onAttrChange?.(a, b, c)
    }
}
export interface CustomHTMLElement extends Partial<CustomElementHookOptions> {}

customElements.define('custom-element', CustomHTMLElement)

export interface CustomElementHookOptions {
    onConnect?: () => void
    onDisconnect?: () => void
    onMove?: () => void
    onAdopted?: () => void
    onAttrChange?: (name: string, oldValue: string, newValue: string) => void
}

declare global {
    interface HTMLElementTagNameMap {
        'custom-element': CustomHTMLElement
    }
}
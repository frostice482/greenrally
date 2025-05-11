import { jsx, JSX } from "jsx-dom/jsx-runtime"
import { textState, ValueState } from "lib/state"

export function StateButton(opts: StateButtonOptions & Omit<btn, 'onClick'>) {
	let { textState: textStateProp = "", once, cOnClick, cOnClickError, ...btn } = opts

	if (typeof textStateProp === 'string') textStateProp = textState(textStateProp)
	const button = jsx("button", btn)
	if (textStateProp) button.append(textStateProp())

	if (cOnClick) button.addEventListener('click', async ev => {
		try {
			button.disabled = true
			await cOnClick.call(button, ev as never, textStateProp)
			if (!once) button.disabled = false
		} catch(e) {
			button.disabled = false
			textStateProp(null)
			if (cOnClickError) cOnClickError.call(button, e)
			else throw e
		}
	})
	return button
}

export function Tag(opts: TagOptions) {
    const {name, ...btn} = opts

    const elm = jsx("button", btn)
    if (!elm.childElementCount) elm.append(name)
    elm.classList.add("rally-tag")
    elm.classList.add("focuseffect")
    return elm
}

type btn = JSX.IntrinsicElements['button']

export interface TagOptions extends btn {
    name: string
}

export interface StateButtonOptions extends E.button {
	textState?: ValueState<Text, string | null> | string
	once?: boolean
	cOnClick?: (this: HTMLButtonElement, event: PointerEvent & { currentTarget: HTMLButtonElement }, textState: ValueState<Text, string | null>) => void
	cOnClickError?: (this: HTMLButtonElement, err: unknown) => void
}

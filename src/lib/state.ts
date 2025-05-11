/**
 * get/set variable in function form
 * @param value Initial value
 * @param change Function to call when value has been changed
 */
export function valueState<T, S = T>(value: T, change = (next: S, prev: T): T => next as never): ValueState<T, S> {
	const state = function() {
		if (0 in arguments) value = change(arguments[0], value)
		return value
	}

	state.valueOf = () => value
	state.toString = () => String(value)
	return state
}

/**
 * Node get/set variable in function form,
 * which replaces old node with new node when value changes
 * @param value Initial node
 * @param change Function to call when node has changed
 */
export function nodeState<T extends Node = Node | Text>(value: T = document.createComment('') as any, change = (next: T, prev: T): T => next): NodeState<T> {
	const s = valueState(value, (next: any, prev) => {
		if (next === null) next = document.createComment('')
		if (typeof next === 'string') next = document.createTextNode(next)
		if (next === prev) return next
		next = change(next, prev)
		prev.parentNode?.replaceChild(next, prev)
		return next
	}) as NodeState<T>

	Object.defineProperty(s, 'rootNode', {
		get() { return s() },
		configurable: true
	})

	return s
}

export function textState(defaultText = '') {
	return valueState<Text, string | null>(document.createTextNode(defaultText), (n, p) => {
		p.data = n ?? defaultText
		return p
	})
}

export interface ValueState<T, S = T> {
	(): T
	(setValue: S): T
	valueOf(): T
}

export interface NodeState<T extends Node = Node> extends ValueState<T, T extends Text ? string : T | null> {
	get rootNode(): T
}

export interface InputState<T extends InputValues> extends ValueState<T> {
	input(ev: Event & { currentTarget: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement }): T
}

export type InputValues = string | number | boolean | Date | FileList

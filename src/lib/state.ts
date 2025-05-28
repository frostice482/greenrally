import { Component, ReactElement } from "jsx-dom"

/**
 * get/set variable in function form
 * @param value Initial value
 * @param change Function to call when value has been changed
 */
export function valueState<T, S = T>(value: T, change = (next: S, prev: T): T => next as never): ValueState<T, S> {
	const state = function() {
		if (0 in arguments) value = state.change(arguments[0], value)
		return value
	}

	state.change = change
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
	return valueState(value, (next: any, prev) => {
		if (next === null) next = document.createComment('')
		if (typeof next === 'string') next = document.createTextNode(next)
		if (next === prev) return next
		next = change(next, prev)
		prev.parentNode?.replaceChild(next, prev)
		return next
	})
}

export function componentState<T extends ReactElement = ReactElement>(value: T = document.createComment('') as any): ValueState<T, Component | T> {
	return valueState<T, Component | T>(value, (next, prev) => {
		const nextNode = next instanceof Node ? next : next.render() ?? document.createComment('')
		prev.parentNode?.replaceChild(nextNode, prev)
		return nextNode as never
	})
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
	change: (next: S, prev: T) => T
}

export type NodeState<T extends Node = Node> = ValueState<T, T extends Text ? string : T | null>

export interface InputState<T extends InputValues> extends ValueState<T> {
	input(ev: Event & { currentTarget: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement }): T
}

export type InputValues = string | number | boolean | Date | FileList

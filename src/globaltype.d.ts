import { DetailedHTMLProps, HTML, JSX } from "jsx-dom"

declare module 'jsx-dom' {
	interface CSSProperties {
		[k: `--${string}`]: string | number
	}
}

declare global {
	declare module '*.scss' {}

	declare module '*?url' {
		const t: string
		export default t
	}

	declare module '*?raw' {
		const t: string
		export default t
	}

	type URLSearchParamsInit = string[][] | Record<string, string> | string | URLSearchParams

	interface NodeObject {
		readonly rootNode: Node
	}

	interface Node {
		cloneNode(deep?: boolean): this
	}

	namespace E {
		type div = JSX.IntrinsicElements['div']
		type header = JSX.IntrinsicElements['header']
		type span = JSX.IntrinsicElements['span']
		type input = JSX.IntrinsicElements['input']
		type button = JSX.IntrinsicElements['button']
		type form = JSX.IntrinsicElements['form']
	}
}

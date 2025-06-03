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

	declare module '*?url&raw' {
		const t: string
		export default t
	}

	declare module '*?url&no-inline' {
		const t: string
		export default t
	}

	type ReadonlyRecord<K, V> = { readonly [X in K]: V }
	type PartialRecord<K, V> = { [X in K]?: V }

	type URLSearchParamsInit = string[][] | Record<string, string> | string | URLSearchParams

	interface Node {
		cloneNode(deep?: boolean): this
	}

	namespace E {
		type a = HTMLAnchorElement
		type button = HTMLButtonElement
		type input = HTMLInputElement
		type img = HTMLImageElement
		type form = HTMLFormElement
		type select = HTMLSelectElement
		type textarea = HTMLTextAreaElement
	}
	type E = HTMLElement

	namespace O {
		type a = JSX.IntrinsicElements['a']
		type button = JSX.IntrinsicElements['button']
		type input = JSX.IntrinsicElements['input']
		type img = JSX.IntrinsicElements['img']
		type div = JSX.IntrinsicElements['div']
	}
	type O = JSX.IntrinsicElements['bdi']
}

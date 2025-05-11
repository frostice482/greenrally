import { DetailedHTMLProps, HTML } from "jsx-dom"

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
}

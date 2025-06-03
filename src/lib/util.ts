export function iterateParent(node: Node, includeSelf: false): Iterable<Element>
export function iterateParent<T extends Element>(node: T, includeSelf?: true): Iterable<T | Element>

export function* iterateParent(node: Node, includeSelf = true): Iterable<Node> {
	if (includeSelf) yield node
	let p = node.parentElement
	while(p) {
		yield p
		p = p.parentElement
	}
}
export function refreshingTimeout(cb: () => void) {
	let id: number | undefined
	return (delay: number | null) => {
		if (id !== undefined) clearTimeout(id)
		if (delay != null) id = setTimeout(cb, delay)
	}
}

export function roundInterval(n: number, interval: number) {
	return Math.floor(n / interval) * interval
}

export function createProxyURLSearchObj(search: URLSearchParams): Record<string, string> {
	return new Proxy({ [Symbol('searchParams')]: search }, {
		get(t, p) {
			if (typeof p === 'string') return search.get(p) ?? undefined
		},
		set(t, p, v) {
			if (typeof p !== 'string') return true

			if (v == undefined) search.delete(p)
			else search.set(p, v)

			return true
		},
		deleteProperty(t, p) {
			if (typeof p === 'string') search.delete(p)
			return true
		},
		has(t, p) {
			return typeof p === 'string' && search.has(p)
		}
	})
}

export async function sleep(ms: number) {
	return new Promise(res => setTimeout(res, ms))
}

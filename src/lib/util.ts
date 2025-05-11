export function createProxyURLSearchObj(search: URLSearchParams): Record<string, string> {
	return new Proxy({}, {
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

export function refreshingTimeout(cb: () => void) {
	let id: number | undefined
	return (delay: number | null) => {
		if (id !== undefined) clearTimeout(id)
		if (delay != null) id = setTimeout(cb, delay)
	}
}

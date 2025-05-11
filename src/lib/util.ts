export function refreshingTimeout(cb: () => void) {
	let id: number | undefined
	return (delay: number | null) => {
		if (id !== undefined) clearTimeout(id)
		if (delay != null) id = setTimeout(cb, delay)
	}
}

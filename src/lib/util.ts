export function filePicker(accept?: string, multiple?: boolean) {
	return new Promise<void | File[]>(res => {
		const n = document.createElement('input')
		n.type = "file"
		n.hidden = true
		if (accept) n.accept = accept
		if (multiple) n.multiple = multiple

		document.body.append(n)
		n.addEventListener('change', () => res(Array.from(n.files!)))
		n.addEventListener('cancel', () => res())
		n.click()
		n.remove()
	})
}

export function clamp(value: number, min: number, max: number) {
	return Math.max(Math.min(value, max), min)
}

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

export function* iterateItem<T>(iterable: { item(i: number): T, readonly length: number }) {
	for (let i = 0; i < iterable.length; i++) yield iterable.item(i)
}

export function* iterateNode(nodeIterator: NodeIterator) {
	let n
	while (n = nodeIterator.nextNode()) yield n
}

export function omit<O, K extends keyof O>(obj: O, keys: Iterable<K>, target: Omit<O, K> & Partial<O> = {...obj}): Omit<O, K> {
	for (const k of keys) delete target[k]
	return target
}

export function pick<O, K extends keyof O>(obj: O, keys: Iterable<K>, target: Pick<O, K> = Object.create(null)): Pick<O, K> {
	for (const k of keys) target[k] = obj[k]
	return target
}

export function refreshingTimeout(cb: () => void) {
	let id: number | undefined
	return (delay: number | null) => {
		if (id !== undefined) clearTimeout(id)
		if (delay != null) id = setTimeout(cb, delay)
	}
}

export function createFileURLDisposable(file: Blob | MediaSource) {
	const url = URL.createObjectURL(file)
	fileDispose.register(file, url, file)
	return url
}

const fileDispose = new FinalizationRegistry<string>(value => {
	console.log('disposed URL file of', value)
	URL.revokeObjectURL(value)
})

export const officeTypes = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx']
export const imgTypes = ['jpg', 'png', 'jpeg', 'bmp', 'apng', 'avif', 'gif', 'jfif', 'svg', 'webp']
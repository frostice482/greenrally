import TypedEventTarget from "lib/typedevt";
import { iterateParent } from "lib/util";
import { nodeState } from "lib/state";
import { jsx } from "jsx-dom/jsx-runtime";
import BComp from "./bcomp";

export class NamedTab<Obj extends Partial<Record<never, TabContent>>, Events = {}> extends TypedEventTarget<Events & { tabchange: NamedTabMap<Obj>[keyof Obj] }> {
	constructor(tabs: Obj, focus?: keyof Obj & string) {
		super()
		this.tabs = tabs
		if (focus) this.setTab(focus)
	}

	tabChangeEvent = new TypedEventTarget<NamedTabMap<Obj>>()
	tabs: Obj
	currentActiveTab?: keyof Obj & string

	contentNode = nodeState()

	protected _setTab(tab: keyof Obj & string, content?: TabContent) {
		let eventData

		const b = this.tabChangeEvent.dispatchEvent(eventData = new TabChangeEvent(tab, content, tab))
		const a = this.dispatchEvent(eventData = new TabChangeEvent(tab, content, 'tabchange'))
		content = eventData.content
		if (!content || !a || !b) return

		this.currentActiveTab = tab
		const contentNode = content instanceof Node ? content : content.node()
		this.contentNode(contentNode)
		return content
	}

	process(element: Element, attrName = 'data-tabname') {
		for (const parent of iterateParent(element)) {
			const attr = parent.getAttribute(attrName)
			if (!attr) continue

			this.setTab(attr as never)
			return attr
		}
	}

	setTab<T extends keyof Obj & string>(tab: T): Obj[T] {
		const content = this.tabs?.[tab] as any
		if (content && this.contentNode() !== (content instanceof Node ? content : content.render())) this._setTab(tab, content)
		return content
	}
}


export function TabNode(opts: TabNodeOptions & O.div) {
	const { tab, tabClass = 'tab', selectedClass = 'selected', attrName = 'data-tabname', buttons } = opts
	opts.class ??= 'tab-list'
	const elm = jsx('div', opts)

	elm.addEventListener('click', ev => tab.process(ev.target as Element, attrName))
	const selecteds = elm.getElementsByClassName(selectedClass)
	const tabs = elm.getElementsByClassName(tabClass)

	tab.addEventListener('tabchange', ({ tab }) => {
		for (const selected of Array.from(selecteds)) {
			selected.classList.remove(selectedClass)
		}

		const relatedElm = Array.from(tabs).find(v => v.getAttribute(attrName) === tab)
		relatedElm?.classList.add(selectedClass)
	})

	if (buttons) {
		for (const [k,v] of Object.entries(buttons)) {
			if (v === false) continue
			elm.append(<Tab name={k}>{v === true ? k : v}</Tab>)
		}
	}

	if (tab.currentActiveTab) {
		const elm = Array.from(tabs).find(v => v.getAttribute(attrName) === tab.currentActiveTab)
		elm?.classList.add(selectedClass)
	}

	return elm
}

export function Tab(opts: TabButtonOptions & O.button) {
	opts.class ??= 'tab'
	const btn = jsx('button', opts)
    if (opts.name) {
		if (!btn.hasChildNodes()) btn.append(opts.name)
		btn.setAttribute(opts.prop ?? 'data-tabname', opts.name)
    }
    return btn
}

export class TabChangeEvent<K, T> extends Event {
	constructor(tab: K, content: T, type = 'tabchange', init?: EventInit) {
		super(type, init)
		this.tab = tab
		this.content = content
	}

	readonly tab: K
	content: T
}

export type NamedTabMap<TabMap> = { [K in keyof TabMap]-?: TabChangeEvent<K, TabMap[K]> }
export type TabContent = Node | BComp

export interface TabNodeOptions {
	tab: NamedTab<any>
	tabClass?: string
	selectedClass?: string
	attrName?: string
	border?: 'top' | 'bottom' | 'both' | boolean
	buttons?: ReadonlyRecord<string, string | boolean>
}

export interface TabButtonOptions {
	name: string
	prop?: string
}
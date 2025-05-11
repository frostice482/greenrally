import TypedEventTarget from "lib/typedevt";
import { iterateParent } from "lib/util";
import { nodeState } from "lib/state";

export class NamedTab<Obj extends Partial<Record<string, TabContent>>, Events = {}> extends TypedEventTarget<Events & { tabchange: NamedTabMap<Obj>[keyof Obj] }> {
	constructor(tabs: Obj) {
		super()
		this.tabs = tabs
	}

	tabChangeEvent = new TypedEventTarget<NamedTabMap<Obj>>()
	tabs: Obj
	currentActiveTab?: keyof Obj & string

	contentNode = nodeState()

	protected _setTab(tab: string, content?: TabContent, userClick = false) {
		let eventData

		const a = this.dispatchEvent(eventData = new TabChangeEvent(tab, content, userClick, 'tabchange'))
		const b = this.tabChangeEvent.dispatchEvent(eventData = new TabChangeEvent(tab, content, userClick, tab))
		content = eventData.content
		if (!content || !a || !b) return

		this.currentActiveTab = tab
		const contentNode = content instanceof Node ? content : content.rootNode
		this.contentNode(contentNode)
		return content
	}

	process(element: unknown, attrName = 'data-tabname') {
		if (!(element instanceof Element)) return

		for (const parent of iterateParent(element)) {
			const attr = parent.getAttribute(attrName)
			if (!attr) continue

			this.setTab(attr as never, true)
			return attr
		}
	}

	setTab<T extends keyof Obj & string>(tab: T, userClick = false): Obj[T] {
		const content = this.tabs?.[tab]
		if (content && this.contentNode() !== (content instanceof Node ? content : content.rootNode)) this._setTab(tab, content, userClick)
		return content
	}
}

export class TabChangeEvent<K, T> extends Event {
	constructor(tab: K, content: T, userClick: boolean, type = 'tabchange', init?: EventInit) {
		super(type, init)
		this.tab = tab
		this.content = content
		this.userClick = userClick
	}

	readonly tab: K
	content: T
	userClick: boolean
}

export type NamedTabMap<TabMap> = { [K in keyof TabMap]-?: TabChangeEvent<K, TabMap[K]> }
export type TabContent = Node | NodeObject

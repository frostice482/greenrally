import { ReactElement } from "jsx-dom"
import BComp from "./bcomp"
import Rally from "./rally"
import { Tag } from "./util"

export default class RallyList<T extends RallyListOpts = RallyListOpts>  extends BComp<T> {
    constructor(opts: T) {
        super(opts)

        this.beforeRender()
        this.list = this.makeList()
        this.updateList(opts.rallies)
        this.node = this.makeNode()
    }

    rallies = new Map<Data.Rally, ReactElement>
    declare ralliesByTags: Map<string, Set<Data.Rally>>
    declare tagHeaders: Map<string, ReactElement>
    selectedTag?: string

    list
    node

    protected handleTagSelect(tag: string, fromRally = false) {
        const old = this.selectedTag
        if (old == tag && fromRally) return

        if (old) {
            this.tagHeaders.get(old)?.classList.remove("focus")
            this.selectedTag = undefined
        }
        if (tag !== old) {
            this.selectedTag = tag
            this.tagHeaders.get(tag)?.classList.add("focus")
        }
        this.resetList()
    }

    protected updateList(rallies: Iterable<Data.Rally>) {
        const oldRallies = this.rallies
        this.rallies = new Map
        this.ralliesByTags = new Map

        const onRallyInfo = this.props.onRallyInfoClick
        for (const rally of rallies) {
            this.rallies.set(rally, oldRallies.get(rally) ?? <Rally
                rally={rally}
                onInfoClick={onRallyInfo}
                onTagClick={tag => this.handleTagSelect(tag, true)}
            />)

            for (const tag of rally.tags) {
                let set = this.ralliesByTags.get(tag)
                if (!set) this.ralliesByTags.set(tag, set = new Set)
                set.add(rally)
            }
        }

        this.tagHeaders = new Map(this.makeTagHeaders())
        this.resetList()
    }

    protected makeTagHeaders(): [string, ReactElement][] {
        return Array.from(this.ralliesByTags)
            .sort(({1: a}, {1: b}) => b.size - a.size)
            .map(({0: tag}) => [tag, <Tag name={tag} onClick={() => this.handleTagSelect(tag)}/>])
    }

    protected resetList() {
        if (!this.selectedTag) {
            this.list.replaceChildren(...this.rallies.values())
        } else {
            this.list.replaceChildren()
            for (const [rally, node] of this.rallies) {
                if (rally.tags.includes(this.selectedTag)) this.list.append(node)
            }
        }
    }

    protected makeList() {
        return <div class="rally-list"></div>
    }

    protected makeNode() {
        return <div>
            <div class="margin">
                {Array.from(this.tagHeaders.values())}
            </div>
            {this.list}
        </div>
    }

    render() {
        console.log(this)
        return this.node
    }
}

export interface RallyListOpts {
    rallies: Iterable<Data.Rally>
    onRallyInfoClick?: () => void
}
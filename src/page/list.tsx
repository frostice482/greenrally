import CRally from "components/rally";
import Tag from "components/tag";
import { Component, ReactElement } from "jsx-dom";

export default class PList extends Component<PListOpts> {
    constructor(opts: PListOpts) {
        super(opts)
        const onRallyInfo = this.props.onRallyInfoClick

        for (const rally of opts.rallies) {
            this.rallies.set(rally, <CRally
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

        this.list = this.makeList()
        this.tagHeaders = new Map(this.makeTagHeaders())
        this.node = this.makeNode()
        this.resetList()
    }

    rallies = new Map<Data.Rally, ReactElement>
    ralliesByTags = new Map<string, Set<Data.Rally>>()
    tagHeaders:  Map<string, ReactElement>
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
        return <div class="p-home-list"></div>
    }

    protected makeNode() {
        return <div class="p-home">
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

export interface PListOpts {
    rallies: Iterable<Data.Rally>
    onRallyInfoClick?: () => void
}
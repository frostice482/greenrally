import { Tag } from "./util";
import BComp from "./bcomp";

export default class Rally extends BComp<CRallyOpts> {
    constructor(param: CRallyOpts) {
        super(param)
        this.detail = this.makeDetail()
        this.summary = this.makeSummary()
        this.node = this.makeNode()
    }

    get rally() { return this.props.rally }

    detail
    summary
    node

    protected makeDetail() {
        const rally = this.props.rally
        return <div class="rally-detail flex-col noflow fill-y">
            <div style={{overflow: 'auto'}}>{rally.description}</div>
            <div class="flex-row justify-between margin-top">
                <small>Tags: {rally.tags.map(v => <Tag name={v} onClick={() => this.props.onTagClick?.(v)}/>)}</small>
                <button class="rally-info focuseffect" onClick={this.props.onInfoClick}>Info</button>
            </div>
        </div>
    }

    protected makeSummary() {
        const rally = this.props.rally
        return <div class="flex-col noflow">
            <h2 class="linelimit noshrink">{rally.name}</h2>
            <div class="linelimit noshrink"><small>{rally.author.name}</small></div>
            {this.detail}
        </div>
    }

    protected makeNode() {
        const rally = this.props.rally
        const n = <div class="rally" style={{backgroundImage: `url(${rally.backgroundLink})`}}>
            {this.summary}
        </div>
        for (const tag of this.rally.tags) n.classList.add('rally-' + tag)
        return n
    }

    render() {
        return this.node
    }
}

export interface CRallyOpts {
    rally: Data.Rally
    onInfoClick?: () => void
    onTagClick?: (tag: string) => void
}

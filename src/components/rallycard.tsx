import BComp from "./bcomp";
import { Tag } from "./util";

export default class RallyCard<T extends RallyOpts = RallyOpts> extends BComp<T> {
    constructor(param: T) {
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
        return <div class="rally-card-detail bigside-top noflow fill-y">
            <div class="flow">{rally.description}</div>
            <small>Tags: {rally.tags.map(v => <Tag name={v} onClick={() => this.props.onTagClick?.(v)}/>)}</small>
            <button class="rally-button" onClick={this.props.onInfoClick}>Info</button>
        </div>
    }

    protected makeSummary() {
        const rally = this.props.rally
        return <div class="flex-col noflow">
            <div class="rally-cardtitle bigside-top">
                <h2 class="linelimit">{rally.name}</h2>
                <img src={rally.author.profileLink} class="fill-1em round"/>
                <small>{rally.author.name}</small>
            </div>
            {this.detail}
        </div>
    }

    protected makeNode() {
        const rally = this.props.rally
        const n = <div class="rally-card" style={{backgroundImage: `url(${rally.backgroundLink})`}}>
            {this.summary}
        </div>
        for (const tag of this.rally.tags) n.classList.add('rally-' + tag)
        return n
    }

}

export interface RallyOpts {
    rally: Data.Rally
    onInfoClick?: () => void
    onTagClick?: (tag: string) => void
}

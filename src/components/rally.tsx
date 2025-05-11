import { Component, ReactElement } from "jsx-dom";
import Tag from "./tag";

export default class CRally extends Component<CRallyOpts> {
    constructor(param: CRallyOpts) {
        super(param)
        this.detail = this.makeDetail(param.rally)
        this.summary = this.makeSummary(param.rally)
        this.node = this.makeNode(param.rally)
    }

    get rally() { return this.props.rally }

    detail: ReactElement
    summary: ReactElement
    node: ReactElement

    protected makeDetail(rally: Data.Rally) {
        return <div class="rally-detail flex-col noflow fill-y">
            <div style={{overflow: 'auto'}}>{rally.description}</div>
            <div class="flex-row justify-between margin-top">
                <small>Tags: {rally.tags.map(v => <Tag name={v} onClick={this.props.onTagClick}/>)}</small>
                <button class="rally-info" onClick={this.props.onInfoClick}>Info</button>
            </div>
        </div>
    }

    protected makeSummary(rally: Data.Rally) {
        return <div class="flex-col noflow">
            <h2 class="linelimit noshrink">{rally.name}</h2>
            <div class="linelimit noshrink"><small>{rally.author.name}</small></div>
            {this.detail}
        </div>
    }

    protected makeNode(rally: Data.Rally) {
        return <div class="rally" style={{backgroundImage: `url(${rally.backgroundLink})`}}>
            {this.summary}
        </div>
    }

    render() {
        return this.node
    }
}

export interface CRallyOpts {
    rally: Data.Rally
    onInfoClick?: () => void
    onTagClick?: () => void
}

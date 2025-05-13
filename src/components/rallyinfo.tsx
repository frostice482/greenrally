import { ReactElement } from "jsx-dom";
import BComp from "./bcomp";
import Format from "./formats";
import { Tag } from "./util";

export default class RallyInfo<T extends RallyInfoOpts = RallyInfoOpts> extends BComp<T> {
    constructor(props: T) {
        super(props)
        this.beforeRender()
        this.node = this.makeNode()
    }

    node: ReactElement

    protected makeNode() {
        const rally = this.props.rally
        const t = Date.now()
        const isOngoing = rally.startTime < t && t < rally.endTime
        const status = t < rally.startTime ? 'Upcoming' : t < rally.endTime ? 'Ongoing' : 'Outdated'
        const bg = `linear-gradient(to bottom, #fff5, #fffe 5em), url('${rally.backgroundLink}')`

        return <div class="rally-detail flex-col container" style={{ backgroundImage: bg }}>
            <div>
                <h2>{rally.name}</h2>
                {rally.author.name} - {Format.dateTime.formatRange(rally.startTime, rally.endTime)}
                <span class={["rally-ttag", isOngoing ? "rally-ttag-current" : "rally-ttag-not"]}>{status}</span>
                <hr/>
            </div>

            <div class="flow">{rally.description}</div>

            <div class="margin-top">
                <small>Tags: {rally.tags.map(v => <Tag name={v} onClick={() => this.props.onTagClick?.(v)}/>)}</small>
                <button class="rally-button right" onClick={this.props.onJoinClick}>Join</button>
            </div>
        </div>
    }
}

export interface RallyInfoOpts {
    rally: Data.Rally
    onJoinClick?: () => void
    onTagClick?: (tag: string) => void
}
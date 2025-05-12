import { ReactElement } from "jsx-dom";
import BComp from "./bcomp";
import Format from "./formats";

export default class RallyInfo<T extends RallyInfoOpts = RallyInfoOpts> extends BComp<T> {
    constructor(props: T) {
        super(props)
        this.beforeRender()
        this.header = this.makeHeader()
        this.node = this.makeNode()
    }

    header
    node: ReactElement

    protected makeHeader() {
        const rally = this.props.rally
        const t = Date.now()
        const isOngoing = rally.startTime < t && t < rally.endTime
        const status = t < rally.startTime ? 'Upcoming' : t < rally.endTime ? 'Ongoing' : 'Outdated'
        const bg = `linear-gradient(to bottom, #fff7 0 50%, white), url('${rally.backgroundLink}')`

        return <div class="rally-detail-header bg-cover" style={{ backgroundImage: bg }}>
            <h2>{rally.name}</h2>
            <small>
                {rally.author.name} - {Format.dateTime.formatRange(rally.startTime, rally.endTime)}
                <span class={["rally-ttag", isOngoing ? "rally-ttag-current" : "rally-ttag-not"]}>{status}</span>
            </small>
            <hr/>
        </div>
    }

    protected makeNode() {
        const rally = this.props.rally
        return <div class="rally-detail container">
            {this.header}
            <div>{rally.description}</div>
        </div>
    }
}

export interface RallyInfoOpts {
    rally: Data.Rally
}
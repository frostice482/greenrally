import { VData } from "data"
import { UserIcon, Button } from "./lib/util"
import defaultImage from "/default.webp?url"
import BCompState from "./lib/bcomp_state"
import Hook from "./lib/hook"

export default class RallyCard extends BCompState<RallyCardOptions> {
    get rally() { return this.props.rally }
    set rally(v) { this.props.rally = v }

    title = <h2 class="linelimit-1">{this.rally.title}</h2>

    protected getState() {
        return this.rally
    }

    protected makeDetail() {
        const rally = this.rally
        return <div class="rally-card-detail bigside-top">
            {this.title}
            <UserIcon user={rally.author} onClick={() => this.props.onProfileClick?.(rally.author)}/>
            <Button size="x" class="rally-card-details-button bsmall" onClick={this.props.onClick}>Details</Button>
        </div>
    }

    protected makeNode() {
        this.title.textContent = this.rally.title
        const rally = this.rally
        const bgsrc = rally.pictureLinks[0]
        const bgimg = `url(${JSON.stringify(bgsrc || defaultImage)})`

        const root = <Hook
            onConnect={() => this.render()}
            onMove={() => this.render()}
            class="rally-card border bgcover"
            style={{backgroundImage : bgimg}}
        >
            {this.makeDetail()}
        </Hook>

        root.addEventListener('pointerenter', () => {
            this.title.classList.remove('linelimit-1')
        })
        root.addEventListener('pointerleave', () => {
            this.title.classList.add('linelimit-1')
        })

        return root
    }
}

export interface RallyCardOptions {
    rally: VData.Rally
    onClick?: () => void
    onProfileClick?: (user: VData.User) => void
}
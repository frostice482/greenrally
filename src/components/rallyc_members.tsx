import { VData } from "data";
import BComp from "./bcomp";
import { UserIcon } from "./util";
import resizeListener from "lib/resize";

export default class Rally_Members extends BComp<RallyMemberOptions> {
    protected makeUser(user: VData.User) {
        return <UserIcon defaultImage="dark" imageSize="2.5em" user={user} onClick={() => this.props.onProfileClick?.(user)}/>
    }

    protected makeUsers(users: readonly VData.User[]) {
        const elm = <div style={{display: 'grid', gap: '16px'}}>
            {users.map(v => this.makeUser(v))}
        </div>

        resizeListener.listen(elm, entry => {
            const repeatCount = Math.max(Math.floor(entry.contentRect.width / 250), 1)
            elm.style.gridTemplateColumns = `repeat(${repeatCount}, 1fr)`
        })

        return elm
    }

    protected makeNode() {
        const rally = this.props.rally
        return <div class="rally-members">
            <h2>Members</h2>
            {this.makeUsers(Array.from(rally.members.values()))}
        </div>
    }
}

export interface RallyMemberOptions {
    rally: VData.Rally
    onProfileClick?: (user: VData.User) => void
}
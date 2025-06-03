import { VData } from "data"
import BComp from "./lib/bcomp"
import { Avatar } from "./lib/util"
import RallyCard from "./rally_card"
import RallyList from "./rally_list"

export default class Profile extends BComp<UserOptions> {
    protected makeOptions() {
        return <div>
            <button onClick={this.props.onLogout} class="bsmall">Logout</button>
        </div>
    }

    protected makeAccountInfo() {
        const user = this.props.user
        const isCur = this.props.isCurrent
        return <div class="container-large flex-aa">
            <Avatar dark src={user.pictureLink} width="5em"/>
            <div class="flex-fill">
                <h1>{user.name}</h1>
                {isCur && <span>{user.email}</span>}
                <div>{user.isCoordinator ? 'Coordinator' : 'Participant'}</div>
            </div>
            {isCur && this.makeOptions()}
        </div>
    }

    protected makeNode() {
        const user = this.props.user
        return <div class="profile">
            {this.makeAccountInfo()}
            <hr/>
            <div class="col-2 container">
                <div>
                    <h2>About Me</h2>
                    {user.aboutMe}
                </div>
                <div>
                    <h2>Recent Events</h2>
                    <RallyList
                        hideTags
                        rallies={user.recentRallies}
                        onProfileClick={this.props.onProfileClick}
                        onRallyClick={this.props.onRallyClick}
                    />
                </div>
            </div>
        </div>
    }
}

export interface UserOptions {
    user: VData.User
    isCurrent?: boolean

    onLogout?: () => void

    onRallyClick?: (rally: VData.Rally, elm: RallyCard) => void
    onProfileClick?: (user: VData.User, elm: RallyCard) => void
}
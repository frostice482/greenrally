import { VData } from "data"
import { ReactElement } from "jsx-dom"
import Format from "lib/formats"
import { nodeState } from "lib/state"
import Forum from "./forum"
import { NamedTab, TabNode } from "./lib/namedtab"
import { Button, UserIcon } from "./lib/util"
import Rally_About from "./rallyc_about"
import Rally_Forums from "./rallyc_forums"
import Rally_Members from "./rallyc_members"
import defaultImage from "/default.webp?url"
import BCompState from "./lib/bcomp_state"

export default class RallyContainer extends BCompState<RallyContainerOptions> {
    tabs = new NamedTab<RallyTabs>({
        about: new Rally_About(this.rally),
        forums: new Rally_Forums({
            rally: this.rally,
            onForumClick: forum => this.switchToForum(forum)
        }),
        members: new Rally_Members({
            rally: this.rally,
            onProfileClick: user => this.props.onProfileClick?.(user)
        })
    }, 'about')

    get joined() { return this.props.joined ?? false }
    set joined(v) { this.props.joined = v }

    get owner() { return this.props.isCreator ?? false }
    set owner(v) { this.props.isCreator = v }

    get rally() { return this.props.rally }
    set rally(v) { this.props.rally = v }

    joinBtn = nodeState<ReactElement>()

    forumCache = new WeakMap<VData.Forum, Forum>()

    protected getState() {
        return this.rally
    }

    protected updateJoin() {
        const isEditable = this.rally.isActivity || this.rally.startTime > Date.now()
        let newBtn
        if (!isEditable) {}
        else if (this.owner) {
            newBtn = <Button hollow class="rally-edit-button" onClick={() => this.props.onEdit?.(this.rally)}/>
        }
        else {
            if (this.joined)
                newBtn = <Button hollow class="rally-leave-button" style={{'--btncol-hover': '#fd9'}} onClick={() => this.handleLeave()}/>
            else
                newBtn = <Button class="rally-join-button" onClick={() => this.handleJoin()}/>
        }
        this.joinBtn(newBtn ?? null)
    }

    protected handleJoin() {
        const r = this.props.onJoin?.() ?? true
        if (!r) return

        const btn = <Button class="rally-joined-button" onPointerLeave={() => this.updateJoin()}/>
        this.joinBtn(btn)
        this.joined = true
        //this.props.onJoin?.()
    }

    protected handleLeave() {
        const r = this.props.onLeave?.() ?? true
        if (!r) return

        this.joined = false
        this.updateJoin()
        //this.props.onLeave?.()
    }

    protected switchToForum(forum: VData.Forum) {
        let f = this.forumCache.get(forum)
        if (!f) this.forumCache.set(forum, f = new Forum({
            forum: forum,
            onProfileClick: this.props.onProfileClick
        }))
        this.tabs.contentNode(f.render())
    }

    protected makeHeaderDetail() {
        const rally = this.props.rally
        const t = Date.now()
        const x = rally.isActivity ? 'activity'
            : t < rally.startTime ? 'upcoming'
            : t < rally.endTime ? 'ongoing'
            : 'outdated'

        const fmt = Format.dateTime.formatRange(rally.startTime, rally.endTime)

        return <div>
            <h1>{rally.title}</h1>
            <UserIcon user={rally.author} onClick={() => this.props.onProfileClick?.(rally.author)}/>
            <small class="flex-aa rally-time-container">{!rally.isActivity && fmt}<div class={'rally-time-'+x}></div></small>
        </div>
    }

    protected makeNav() {
        this.updateJoin()
        return <div class="flex-col" style={{alignItems: 'end', gap: '4px'}}>
            {this.joinBtn()}
            <TabNode
                tab={this.tabs}
                buttons={{
                    about: 'About',
                    forums: 'Forums',
                    members: 'Members'
                }}
            />
        </div>
    }

    protected makeHeader() {
        const bg = `linear-gradient(to bottom, #0007), url(${JSON.stringify(this.rally.pictureLinks[0] || defaultImage)})`

        return <div class="rally-header bgcover grid-4" style={{backgroundImage: bg}}>
            <div></div>
            <div></div>
            {this.makeHeaderDetail()}
            {this.makeNav()}
        </div>
    }

    protected makeNode() {
        this.tabs.resetAll()
        return <div class="rally">
            {this.makeHeader()}
            {this.tabs.contentNode()}
        </div>
    }
}

export interface RallyTabs {
    about: Rally_About
    forums: Rally_Forums
    members: Rally_Members
}

export interface RallyContainerOptions {
    joined?: boolean
    isCreator?: boolean
    rally: VData.Rally
    onProfileClick?: (user: VData.User) => void
    onJoin?: () => boolean | void | undefined
    onLeave?: () => boolean | void | undefined
    onEdit?: (rally: VData.Rally) => void
}

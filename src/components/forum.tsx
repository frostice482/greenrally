import { VData } from "data";
import BComp from "./bcomp";
import { Avatar } from "./util";
import Format from "lib/formats";

export default class Forum extends BComp<ForumOptions> {
    protected makeForumPostInfo() {
        const forum = this.props.forum
        return <div class="container border fill-x">
            <div class="bigside-left">
                <Avatar dark src={forum.author.pictureLink} width="3em"/>
                <div><b>{forum.author.name}</b> {Format.dateTime.format(forum.time)}</div>
                <h2>{forum.title}</h2>
            </div>
            <hr/>
            {forum.message}
        </div>
    }

    protected makeReply(message: VData.ForumReply) {
        return <div class="forum-reply bigside-left container border" style={{gap: '0 8px'}}>
            <Avatar dark src={message.author.pictureLink} width="2.5em"/>
            <div>
                <div><b>{message.author.name}</b> {Format.dateTime.format(message.time)}</div>
                {message.message}
            </div>
        </div>
    }

    protected makeNode() {
        const forum = this.props.forum
        return <div>
            {this.makeForumPostInfo()}
            <br/>
            <h2>Replies</h2>
            {forum.replies.map(v => this.makeReply(v))}
        </div>
    }
}

export interface ForumOptions {
    forum: VData.Forum
    onProfileClick?: (user: VData.User) => void
}
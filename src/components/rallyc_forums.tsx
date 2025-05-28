import { VData } from "data";
import BComp from "./bcomp";
import { userImgSrc, Image } from "./util";
import Format from "lib/formats";

export default class Rally_Forums extends BComp<RallyForumOptions> {
    protected makeForum(forum: VData.Forum) {
        return <button class="rally-forum-container container border fill-x bigside-left" onClick={() => this.props.onForumClick?.(forum)}>
            <Image src={userImgSrc(forum.author.pictureLink, 'dark')} width="3em"/>
            <div> <b>{forum.author.name}</b> {Format.dateTime.format(forum.time)} </div>
            <h2> {forum.title}</h2>
        </button>
    }

    protected makeNode() {
        const rally = this.props.rally
        return <div class="rally-forums">
            <h2>Forums</h2>
            <br/>
            {Array.from(rally.forums.values(), v => this.makeForum(v))}
        </div>
    }
}

interface RallyForumOptions {
    rally: VData.Rally
    onForumClick?: (forum: VData.Forum) => void
}
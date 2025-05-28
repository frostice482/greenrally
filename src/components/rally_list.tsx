import { VData } from "data";
import BComp from "./bcomp";
import { ReactElement } from "jsx-dom";
import RallyCard from "./rally_card";
import { RallyTag } from "./util";

export default class RallyList extends BComp<RallyListOptions> {
    tagList = new Map<string, ReactElement>()
    rallyList = new Map<VData.Rally, RallyCard>()
    filters: Filter[] = []

    tagListElm = <div class="rally-tag-list flex-aaa"/>
    rallyListElm = <div class="rally-list"/>

    selectedTag?: string

    selectTag(tag?: string, force = true) {
        if (this.selectedTag) {
            this.tagList.get(this.selectedTag)?.classList.remove('focus')
        }
        this.selectedTag = this.selectedTag === tag && !force ? undefined : tag
        if (this.selectedTag) {
            this.tagList.get(this.selectedTag)?.classList.add('focus')
        }

        this.updateRallyListElement()
    }

    updateTagList(removeUnused = false) {
        const newtags = new Map<string, number>()
        for (const rally of this.rallyList.keys()) {
            for (const tag of rally.tags)
                newtags.set(tag, (newtags.get(tag) ?? 0))
        }

        const unused = new Set(this.tagList.keys())
        const sorted = Array.from(newtags).sort(([, a], [, b]) => b - a)

        this.tagListElm.replaceChildren()
        for (const [tag] of sorted) {
            unused.delete(tag)
            let r = this.tagList.get(tag)
            if (!r) {
                r = <RallyTag name={tag} onClick={() => this.selectTag(tag, false)}/>
                this.tagList.set(tag, r)
            }
            this.tagListElm.append(r)
        }
        if (removeUnused) {
            for (const tag of unused) this.tagList.delete(tag)
        }
    }

    updateRallyList(rallies: readonly VData.Rally[] = this.props.rallies, removeUnused = false) {
        this.props.rallies = rallies
        const unused = new Set(this.rallyList.keys())

        for (const rally of rallies) {
            unused.delete(rally)
            let r = this.rallyList.get(rally)
            if (!r) {
                r = new RallyCard({
                    rally,
                    onClick: () => this.props.onRallyClick?.(rally, r!),
                    onProfileClick: () => this.props.onProfileClick?.(rally.author, r!)
                })
                r.render()
                this.rallyList.set(rally, r)
            }
        }
        if (removeUnused) {
            for (const rally of unused) this.rallyList.delete(rally)
        }
    }

    updateRallyListElement() {
        this.rallyListElm.replaceChildren()
        for (const rally of this.props.rallies) {
            const elm = this.rallyList.get(rally)?.node()
            if (!elm || this.selectedTag && !rally.tags.includes(this.selectedTag)) continue
            this.rallyListElm.append(elm)
        }
    }

    protected makeNode() {
        this.updateRallyList()
        this.updateRallyListElement()
        this.updateTagList()

        return <div>
            {!this.props.hideTags && this.tagListElm}
            {this.rallyListElm}
        </div>
    }
}

export interface RallyListOptions {
    rallies: readonly VData.Rally[]
    hideTags?: boolean

    onRallyClick?: (rally: VData.Rally, elm: RallyCard) => void
    onProfileClick?: (user: VData.User, elm: RallyCard) => void
}

type Filter = (rally: VData.Rally, element: ReactElement) => void
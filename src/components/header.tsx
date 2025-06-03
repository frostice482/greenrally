import { nodeState } from "lib/state";
import BComp from "./bcomp";
import { VData } from "data";
import { ReactElement } from "jsx-dom";
import { Avatar, Button } from "./util";
import { refreshingTimeout } from "lib/util";
import searchUrl from "/search.svg?url"
import calendarUrl from "/calendar.svg?url"
import plusUrl from "/plus.svg?url"
import resizeListener from "lib/resize";

export default class Header extends BComp<HeaderOptions> {
    searchInput = <input
        type="search"
        id="searchinput"
        placeholder="Search for a rally"
        class="fill-x"
        onFocus={() => this.searchNode().classList.add('focus')}
        onBlur={() => this.searchNode().classList.remove('focus')}
        onInput={() => this.searchTimeout(500)}
        onKeyDown={ev => {
            if (ev.key !== 'Enter') return
            ev.preventDefault()
            this.props.onSearch?.(this.searchInput.value)
        }}
    /> as E.input

    searchNode = nodeState<ReactElement>(<div/>)
    searchResultContainer = nodeState<ReactElement>(<div/>)
    searchCache = new WeakMap<VData.Rally, Element>()

    account?: VData.User
    accountElm = nodeState<ReactElement>(this.makeSideNode())
    searchTimeout = refreshingTimeout(() => this.props.onSearchPreview?.(this.searchInput.value))

    setAccount(account?: VData.User) {
        this.account = account
        this.accountElm(this.makeSideNode())
    }

    setSearchResult(rallies: Iterable<VData.Rally>) {
        const cnt = this.searchResultContainer()
        cnt.replaceChildren()
        for (const rally of rallies) {
            let s = this.searchCache.get(rally)
            if (!s) this.searchCache.set(rally, s = <HeaderSearch rally={rally} onClick={() => this.props.onRallyClick?.(rally)}/>)
            cnt.append(s)
        }
    }

    protected makeAccountNode() {
        const acc = this.account
        if (acc) return <button id="account-button" class="flex-aa" onClick={this.props.onProfile}>
            <b>{acc.name}</b>
            <Avatar dark src={acc.pictureLink} width="2.5em"/>
        </button>

        return <Button id="login-button" onClick={this.props.onLogin}>Login</Button>
    }

    protected makeCreateNode() {
        return <Button id="create-button" onClick={this.props.onCreateClick}>
            <img src={plusUrl} class="fill-1em"/>
        </Button>
    }

    protected makeSideNode() {
        return <div class="flex-aa" style={{gap: '16px', justifyContent: 'right'}}>
            {this.account && this.makeCreateNode()}
            {this.makeAccountNode()}
        </div>
    }

    protected makeSearchResult() {
        return <div id="search-result">
            Start typing to search.
        </div>
    }

    protected makeSearchBar() {
        this.searchResultContainer(this.makeSearchResult())

        const elm = <div id="search" class="border">
            {this.searchInput}
            <button id="search-button" class="flex" onClick={() => this.props.onSearch?.(this.searchInput.value)} >
                <img src={searchUrl} style={{width: '1.5em'}}/>
            </button>
            {/*this.searchResultContainer()*/}
        </div>

        resizeListener.listen(elm, entry => {
            const cnt = this.searchResultContainer()
            const rect = elm.getBoundingClientRect()
            cnt.style.top = rect.height + 'px'
            cnt.style.width = rect.width + 'px'
        })

        return String(location).endsWith('/') ? elm : <div/>
    }

    protected makeNode() {
        this.searchNode(this.makeSearchBar())

        return <header>
            <div>
                <button onClick={() => this.props.onTitleClick?.()} id="title">GreenRally</button>
            </div>
            {this.searchNode()}
            {this.accountElm()}
        </header>
    }
}

export function HeaderSearch(opts: { rally: VData.Rally } & O.button) {
    const elm = <button {...opts}>
        <img src={calendarUrl} style={{width: '2em'}}/>
        {opts.rally.title}
    </button>
    elm.classList.add("rally-card-search")
    return elm
}

export interface HeaderOptions {
    onTitleClick?: () => void
    onRallyClick?: (rally: VData.Rally) => void
    onProfile?: () => void
    onLogin?: () => void
    onSearch?: (search: string) => void
    onSearchPreview?: (search: string) => void
    onCreateClick?: () => void
}

import { nodeState } from "lib/state";
import BComp from "./bcomp";
import searchUrl from "@/resources/search.svg?url"

export default class Header<T extends HeaderOpts = HeaderOpts> extends BComp<T> {
    constructor(props: T) {
        super(props)
        this.beforeRender()
        this.account(this.makeLogin())
        this.search = this.makeSearch()
        this.node = this.makeNode()
    }

    account = nodeState()
    searchInput = <input
        id="searchinput"
        placeholder="Find a rally"
        type="search"
        class="fill reset"
    /> as HTMLInputElement
    searchBtn = <button id="searchbtn" class="reset flex-row">
        <img src={searchUrl} style={{height: "1em"}}/>
    </button>

    search
    node

    makeLogin() {
        return <button id="button-login">Sign In</button>
    }

    protected makeSearch() {
        return <div id="search">
            {this.searchInput}
            {this.searchBtn}
        </div>
    }

    protected makeNode() {
        return <header>
            <h2 id="title">GreenRally</h2>
            <div>{this.search}</div>
            {this.account()}
        </header>
    }
}

export interface HeaderOpts {
    onLogin?: () => void
    onAccountDetail?: () => void
}
import { nodeState } from "lib/state";
import BComp from "./bcomp";
import searchUrl from "@/resources/search.svg?url"

export default class Header<T extends HeaderOpts = HeaderOpts> extends BComp<T> {
    constructor(props: T) {
        super(props)
        this.beforeRender()
        this.accountNode(this.makeLogin())
        this.search = this.makeSearch()
        this.node = this.makeNode()
    }

    accountNode = nodeState()
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
    protected _account?: Data.User
    get account() { return this._account }

    setAccount(account?: Data.User) {
        this._account = account
        this.accountNode(account ? this.makeAccountDetail(account) : this.makeLogin())
    }

    protected makeLogin() {
        return <button id="button-login" onClick={this.props.onLogin}>Sign In</button>
    }

    protected makeAccountDetail(account: Data.User) {
        return <button class="flex-row align-center" onClick={this.props.onAccountDetail}>
            {account.name}
            <img src={account.profileLink} class="fill-2em round"/>
        </button>
    }

    protected makeSearch() {
        return <div id="search">
            {this.searchInput}
            {this.searchBtn}
        </div>
    }

    protected makeNode() {
        return <header>
            <button id="title" onClick={this.props.onHome}>
                <h2>GreenRally</h2>
            </button>
            <div>{this.search}</div>
            {this.accountNode()}
        </header>
    }
}

export interface HeaderOpts {
    onLogin?: () => void
    onAccountDetail?: () => void
    onHome?: () => void
}
import { nodeState } from "lib/state";
import searchUrl from "@/resources/search.svg?url"
import BComp from "./bcomp";

export default class Header extends BComp<CHeaderOpts> {
    constructor(props: CHeaderOpts) {
        super(props)
        this.beforeRender()
        this.search = this.makeSearch()
        this.node = this.makeNode()
    }

    account = nodeState()
    searchInput = <input
        id="searchinput"
        placeholder="Find a rally"
        type="search"
        class="fill reset"
    />
    searchBtn = <button id="searchbtn" class="reset">
        <img src={searchUrl} style={{height: "1em"}}/>
    </button>

    search
    node

    protected makeSearch() {
        return <div id="search">
            <div>
                {this.searchInput}
                {this.searchBtn}
            </div>
        </div>
    }

    protected makeNode() {
        return <header {...this.props}>
            <h2 id="title">GreenRally</h2>
            {this.search}
            {this.account()}
        </header>
    }

    render() {
        return this.node
    }
}

export interface CHeaderOpts extends E.header {}
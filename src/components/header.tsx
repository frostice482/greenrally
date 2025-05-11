import { nodeState } from "lib/state";
import searchUrl from "@/resources/search.svg?url"
import { Component, ReactElement } from "jsx-dom";

export default class CHeader extends Component {
    constructor(props: {}) {
        super(props)
        this.search = this.makeSearch()
        this.node = this.makeNode()
    }

    account = nodeState()
    searchInput = <input
        id="searchinput"
        placeholder="Find a rally"
        type="text"
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
        return <header>
            <h2 id="title">GreenRally</h2>
            {this.search}
            {this.account()}
        </header>
    }

    render() {
        return this.node
    }
}

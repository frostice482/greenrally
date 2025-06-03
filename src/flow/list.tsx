import flow from "./main"
import data from "data"
import RallyList from "components/rally_list"
import { nodeState } from "lib/state"

let list: RallyList | undefined

flow.define('/', () => {
    list ??= makeList()
    list.updateRallyList(data.rallies.values()).updateAll()

    flow.contentNode(list)
    document.title = `GreenRally`
}, [])

flow.define('/search', ({ q }) => {
    const rallies = data.search.search(q)
    list ??= makeList()
    list.updateRallyList(rallies).updateAll()

    const l = nodeState()
    flow.contentNode(<div>
        <h2>Search result for {q}</h2>
        {rallies.length ? l() : 'No results found'}
    </div>)
    l(list.render())

    document.title = `${q} | GreenRally Search`
}, ['q'])

function makeList() {
    return new RallyList({
        rallies: data.rallies.values(),
        onProfileClick: profile => flow.exec('/profile', { id: profile.id }),
        onRallyClick: rally => flow.exec('/rally', { id: rally.id }),
    })
}

declare global {
    interface MainRoutes {
        '/': {}
        '/search': { q: string }
    }
}

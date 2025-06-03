import Header from "components/header";
import flow from "./main";

const header = new Header({
    onLogin: () => flow.exec('/login', {}),
    onProfile: user => flow.exec('/profile', { id: user.id }),
    onRallyClick: rally => flow.exec('/rally', { id: rally.id }),
    onTitleClick: () => flow.exec('/', {}),
    onCreateClick: () => flow.exec('/edit', {}),
    onSearch: search => {
        search = search.trim()
        if (search) flow.exec('/search', { q: search })
        else flow.exec('/', {})
    }
})

flow.addEventListener('exec', ({ detail: exec }) => {
    const route = exec.route
    header.searchNode().hidden = route.startsWith('/login') || route.startsWith('/register')
})

flow.addEventListener('login', ({ detail: acc }) => {
    header.setAccount(acc)
})

flow.addEventListener('logout', () => {
    header.setAccount()
})

export default header
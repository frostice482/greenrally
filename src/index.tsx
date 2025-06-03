import data from "data"
import urlLoader from "lib/urlloader"
import "flow/index"
import flow from "flow/main"
import header from "flow/header"

header.setAccount(data.currentLogin)

document.body.append(header.render())
document.body.append(flow.contentNode())

flow.addEventListener('login', () => {
    data.save()
}, { capture: true })

flow.addEventListener('logout', () => {
    data.currentLogin = undefined
    data.save()
    flow.exec('/', {})
}, { capture: true })

flow.exec(location.hash.slice(1), {}) || flow.exec('/', {})

addEventListener('hashchange', () => {
    urlLoader.shouldPush = false
    flow.exec(location.hash.slice(1), {})
})

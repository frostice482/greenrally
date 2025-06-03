import RallyContainer from "components/rally"
import flow from "./main"
import data, { VData } from "data"

const rallyCache = new Map<VData.Rally, RallyContainer>()

flow.define('/rally', ({ id }) => {
    const rally = data.rallies.get(id)
    if (!rally) return

    let rc = rallyCache.get(rally)
    if (!rc) rallyCache.set(rally, rc = makeRallyContainer(rally))

    flow.contentNode(rc)
    document.title = `${rally.title} | GreenRally`
}, ['id'])

flow.addEventListener('login', () => {
    rallyCache.clear()
})

flow.addEventListener('logout', () => {
    rallyCache.clear()
})

function makeRallyContainer(rally: VData.Rally) {
    return new RallyContainer({
        rally: rally,
        onProfileClick: profile => flow.exec('/profile', { id: profile.id }),
        isCreator: rally.author === data.currentLogin,
        joined: data.currentLogin?.id !== undefined && rally.members.get(data.currentLogin?.id) !== undefined,
        onJoin: () => {
            if (!data.currentLogin) {
                flow.exec('/login', {})
                return false
            }
            return confirm("Are you sure you want to join this rally?")
        },
        onLeave: () => {
            return confirm("Are you sure you want to leave this rally?")
        },
        onEdit: rally => flow.exec('/edit', { id: rally.id })
    })
}

declare global {
    interface MainRoutes {
        '/rally': {
            id: string
        }
    }
}

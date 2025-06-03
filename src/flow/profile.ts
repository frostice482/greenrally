import flow from "./main"
import data, { VData } from "data"
import Profile from "components/profile"

const profileCache = new Map<VData.User, Profile>()

flow.define('/profile', ({ id }) => {
    const user = data.users.get(id)
    if (!user) return

    let pc = profileCache.get(user)
    if (!pc) profileCache.set(user, pc = makeProfileContainer(user))

    flow.contentNode(pc)
    document.title = `${user.name} | GreenRally User`
}, ['id'])

flow.addEventListener('login', () => {
    profileCache.clear()
})

flow.addEventListener('logout', () => {
    profileCache.clear()
})

function makeProfileContainer(user: VData.User) {
    return new Profile({
        user: user,
        isCurrent: data.currentLogin === user,
        onProfileClick: profile => flow.exec('/profile', { id: profile.id }),
        onRallyClick: rally => flow.exec('/rally', { id: rally.id }),
        onLogout: () => flow.emit('logout', undefined)
    })
}

declare global {
    interface MainRoutes {
        '/profile': {
            id: string
        }
    }
}

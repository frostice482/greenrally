import Header from "components/header";
import Login from "components/login";
import RallyContainer from "components/rally";
import RallyList from "components/rally_list";
import Register from "components/register";
import Profile from "components/profile";
import data, { VData } from "data";
import { componentState } from "lib/state";
import urlLoader from "lib/urlloader";
import RallyEdit, { RallyEditData } from "components/rally_edit";

//navigator.serviceWorker.register('/sw.js')

let profilesCache = new WeakMap<VData.User, Profile>()
let rallyCache = new WeakMap<VData.Rally, RallyContainer>()
let login: Login | undefined
let register: Register | undefined
let extraRedirect = ''
let list: RallyList | undefined
let create: RallyEdit | undefined
const header = new Header({
    onLogin: onLogin,
    onProfile: () => {
        if (data.currentLogin) onProfile(data.currentLogin)
    },
    onRallyClick: onRally,
    onTitleClick: onList,
    onCreateClick: () => onEdit(),
    onSearch: onSearch
    //onSearch
})
header.setAccount(data.currentLogin)

const content = componentState()

async function onEdit(rally?: VData.Rally) {
    if (!data.currentLogin) return onLogin()

    create ??= new RallyEdit({ onPost: onEditPost })
    content(create)
    if (rally) {
        let conf = !create.hasData()
        if (!conf) conf = await new Promise(res => setTimeout(() => res(confirm('Discard previous edit?')), 50))
        if (!conf) return

        create.editFrom(rally)
        content(create)

        editBind.push({id: rally.id})
        document.title = `Edit | GreenRally`
    }
    else {
        editBind.push()
        document.title = `Create | GreenRally`
    }
}

function onSearch(search: string) {
    if (!search.trim()) return onList()
    const rallies = data.search.search(search)

    content(<div>
        <h2>Search result for {search}</h2>
        {rallies.length ? <RallyList rallies={rallies}/> : 'No results found'}
    </div>)
}

async function onEditPost(post: RallyEditData) {
    const assign = {
        title: post.title,
        description: post.description,
        startTime: post.startDate.getTime(),
        endTime: post.endDate.getTime(),
        tags: post.tags,
        isActivity: post.rallyType === 'activity'
    }
    let rally
    if (post.currentEditId) {
        rally = data.rallies.get(post.currentEditId)
        if (!rally) return create?.errmsg('Unknown rally ' + post.currentEditId)
        if (rally.author !== data.currentLogin) return create?.errmsg('Unauthorized')

        data.search.removeRally(rally)
        Object.assign(rally, assign)
        data.search.addRally(rally)
    } else {
        if (!data.currentLogin) return create?.errmsg('Unauthorized')
        rally = await data.createRally({ author: data.currentLogin.id, ...assign })
    }

    list?.updateRallyList(Array.from(data.rallies.values()))
    list?.updateRallyListElement()
    data.save()
    rallyCache.get(rally)?.render(true)
    onRally(rally)

    create = undefined
}

function onList() {
    list ??= new RallyList({
        rallies: Array.from(data.rallies.values()),
        onProfileClick: onProfile,
        onRallyClick: onRally
    })
    content(list)
    urlLoader.pushState('/')
    document.title = `GreenRally`
}

function onRally(rally: VData.Rally) {
    let r = rallyCache.get(rally)
    if (!r) rallyCache.set(rally, r = new RallyContainer({
        rally: rally,
        onProfileClick: onProfile,
        isCreator: rally.author === data.currentLogin,
        joined: data.currentLogin?.id !== undefined && rally.members.get(data.currentLogin?.id) !== undefined,
        onJoin: () => {
            if (!data.currentLogin) {
                onLogin()
                return false
            }
        },
        onEdit: () => onEdit(rally)
    }))
    content(r)
    rallyBind.push({ id: rally.id })
    document.title = `${rally.title} | GreenRally`
    return r
}

function onProfile(user: VData.User) {
    let r = profilesCache.get(user)
    if (!r) profilesCache.set(user, r = new Profile({
        user: user,
        isCurrent: data.currentLogin === user,
        onProfileClick: onProfile,
        onRallyClick: onRally,
        onLogout: onLogout
    }))
    content(r)
    profileBind.push({ id: user.id })
    document.title = `${user.name} | GreenRally User`
    return r
}

function onLogin() {
    login ??= new Login({
        onSubmit: form => {
            const email = form.get('email') as string
            const password = form.get('password') as string

            const user = data.login(email, password)
            if (!user) {
                login?.inputEmail.update('Invalid credentials')
                login?.inputPassword.update('Invalid credentials')
                return
            }

            setBase(user)
        },
        onSwitch: onRegister
    })
    content(login)

    const h = location.hash.slice(1)
    extraRedirect = h.startsWith('/login') || h.startsWith('/register') ? extraRedirect : h
    loginBind.push({ redirect: extraRedirect })
    //document.title = `Login | GreenRally`
}

function onRegister() {
    register ??= new Register({
        onSubmit: form => {
            const email = form.get('email') as string
            const name = form.get('name') as string
            const password = form.get('password') as string

            let hasErr = false
            if (data.usersByName.has(name)) {
                register?.inputName.update('Username already exists')
                hasErr = true
            }
            if (data.usersByEmail.has(email)) {
                register?.inputEmail.update('Email is in use')
                hasErr = true
            }

            if (hasErr) return

            const user = data.register(email, name, password, true)
            setBase(user)
        },
        onSwitch: onLogin
    })
    content(register)

    const h = location.hash.slice(1)
    extraRedirect = h.startsWith('/login') || h.startsWith('/register') ? extraRedirect : h
    registerBind.push({ redirect: extraRedirect })
    document.title = `Register | GreenRally`
}

function onLogout() {
    if (!data.currentLogin) return
    profilesCache.delete(data.currentLogin)
    header.setAccount()

    data.currentLogin = undefined
    data.save()
    urlLoader.pushState('/')
    location.reload()
}

function setBase(user: VData.User) {
    login = undefined
    register = undefined
    profilesCache.delete(user)

    data.currentLogin = user
    data.save()

    header.setAccount(user)
    urlLoader.pushState(extraRedirect)
    location.reload()
}

document.body.append(header.render())
document.body.append(content())

const rallyBind = urlLoader.addBind('/rally', ['id'], ({id, tab}) => {
    const rally = data.rallies.get(id)
    if (!rally) return
    const comp = onRally(rally)
    if (tab) comp.tabs.setTab(tab as never)
})

const profileBind = urlLoader.addBind('/profile', ['id'], ({id}) => {
    const user = data.users.get(id)
    if (!user) return
    onProfile(user)
})

const loginBind = urlLoader.addBind('/login', [], ({redirect}) => {
    extraRedirect = redirect ?? ''
    onLogin()
})

const registerBind = urlLoader.addBind('/register', [], ({redirect}) => {
    extraRedirect = redirect ?? ''
    onRegister()
})

const editBind = urlLoader.addBind('/edit', [], ({id}) => {
    let rally
    if (id) {
        rally = data.rallies.get(id)
        if (rally && rally.author !== data.currentLogin) rally = undefined
    }
    onEdit(rally)
})

urlLoader.addBind('/', [], onList)

if (!urlLoader.exec(location.hash.slice(1))) {
    onList()
}

addEventListener('hashchange', () => {
    urlLoader.shouldPush = false
    urlLoader.exec(location.hash.slice(1))
})
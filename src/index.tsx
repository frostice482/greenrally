import RallyList from "components/list"
import Login from "components/login"
import Popup from "components/popup"
import RallyInfo from "components/rallyinfo"
import Register from "components/register"
import SHeader from "components/super/header"
import data from "defaultdata"
import { nodeState } from "lib/state"

let list: RallyList | undefined
let login: Login | undefined
let register: Register | undefined

const content = nodeState()

const header = new SHeader({
    rallies: Array.from(data.rallies.values()),
    account: data.currentLogin,
    onRallyClick: rally => {
        showInfo(rally)
        header.searchPopup.hide()
    },
    onLogin: () => showLogin(),
    onHome: () => showList(),
})

function showInfo(id: string | Data.Rally) {
    if (typeof(id) === 'string') {
        const rally = data.rallies.get(id)
        if (!rally) return
        id = rally
    }

    const popup = new Popup(<RallyInfo
        rally={id}
        onTagClick={tag => {
            popup.hide()
            showList().selectTag(tag, true)
        }}
        onJoinClick={() => {
            if (!data.currentLogin) {
                showLogin()
                popup.hide()
                return
            }
            popup.children(<div class="container">Successfully join the rally</div>)
        }}
        />,{ blur: true, center: true }
    )

    requestAnimationFrame(() => document.body.append(popup.show()))
}

function showList() {
    list ??= new RallyList({
        rallies: data.rallies.values(),
        onRallyInfoClick: rally => showInfo(rally)
    })
    content(list.render())
    return list
}

function showLogin() {
    login ??= new Login({
        onLogin: (self, email, password) => {
            const user = data.login(email, password)
            if (typeof(user) === 'string') {
                switch (user) {
                    case 'password.invalid':
                        self.emailInput.setError("Username or password incorrect")
                        self.passwordInput.setError("Username or password incorrect")
                    break
                }
                return
            }
            data.save()
            header.setAccount(user)
            showList()
        },
        onSwitch: () => showRegister()
    })
    content(login.render())
    return login
}

function showRegister() {
    register ??= new Register({
        onRegister: (self, email, username, password) => {
            const user = data.register(username, email, password)
            if (typeof(user) === 'string') {
                switch (user) {
                    case 'email.exists':
                        self.emailInput.setError("Email is already taken")
                    break
                    case 'name.exists':
                        self.emailInput.setError("Name is already taken")
                    break
                }
                return
            }
            data.save()
            header.setAccount(user)
            showList()
        },
        onSwitch: () => showLogin()
    })
    content(register.render())
    return register
}

showList()

document.body.append(header.render())
document.body.append(content())

import Login from "components/login"
import flow from "./main"
import data from "data"

let login: Login | undefined
let extraRedirect: string | undefined

flow.define('/login', (arg, bind, { pathname: from, search }) => {
    login ??= makeLogin()
    flow.contentNode(login)

    document.title = `Login | GreenRally`
    extraRedirect = from.startsWith('/login') || from.startsWith('/register') ? extraRedirect || arg.redirect || '/' : from + search
    bind.push({redirect: extraRedirect}, false)
}, [])

function makeLogin() {
    return new Login({
        onSubmit: onSubmit,
        onSwitch: () => flow.exec('/register', {})
    })
}

function onSubmit(form: FormData) {
    const email = form.get('email') as string
    const password = form.get('password') as string

    const user = data.login(email, password)
    if (!user) {
        login?.inputEmail.update('Invalid credentials')
        login?.inputPassword.update('Invalid credentials')
        return
    }

    flow.emit('login', user)
    flow.exec(extraRedirect!, {})
    login = undefined
    extraRedirect = undefined
    alert("Login successful")
}
import Register from "components/register"
import flow from "./main"
import data from "data"

let register: Register | undefined
let extraRedirect: string | undefined

flow.define('/register', (arg, bind, { pathname: from, search }) => {
    register ??= makeRegister()
    flow.contentNode(register)

    document.title = `Register | GreenRally`
    extraRedirect = from.startsWith('/login') || from.startsWith('/register') ? extraRedirect || arg.redirect || '/' : from + search
    bind.push({redirect: extraRedirect}, false)
}, [])

function makeRegister() {
    return new Register({
        onSubmit: onSubmit,
        onSwitch: () => flow.exec('/login', {})
    })
}

function onSubmit(form: FormData) {
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
    flow.emit('login', user)
    flow.exec(extraRedirect!, {})
    register = undefined
    extraRedirect = undefined
    alert("Successfully registered an account")
}
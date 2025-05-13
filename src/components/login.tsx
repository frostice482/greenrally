import BComp from "./bcomp"
import UInput from "./uinput"
import { StateButton } from "./util"

export default class Login<T extends LoginOpts = LoginOpts> extends BComp<T> {
    constructor(props: T) {
        super(props)
        this.beforeRender()
        this.container = this.makeContainer()
        this.node = this.makeNode()
        this.minPasswordLen = props.minPasswordLen || 8

        this.passwordInput.input.addEventListener("change", () => this.reportPasswordTooShort())
    }

    protected text = "Login"

    container
    node
    emailInput = new UInput(<input required id="username" type="email"/>, "Email")
    passwordInput = new UInput(<input required id="password" type="password"/>, "Password")
    minPasswordLen

    protected fields: UInput[] = [this.emailInput, this.passwordInput]

    hasInputFail() {
        return this.fields.some(v => v.input.validationMessage !== "")
    }

    updateInputFail() {
        let setFocus = true
        for (const field of this.fields) {
            if (!field.input.validationMessage) continue
            if (setFocus) {
                field.input.focus()
                setFocus = false
            }
            field.setError(field.input.validationMessage)
        }
        return !setFocus
    }

    protected makeFooter() {
        return <small class="fill-x">
            Don't have an account?
            <a class="right" onClick={this.props.onSwitch}>Sign up</a>
        </small>
    }

    protected makeContainer() {
        return <div class="login-container flex-col align-center container">
            <h2>{this.text}</h2>
            <div class="flex-div"/>

            {this.fields.map(v => v.render())}
            <StateButton class="big-button" cOnClick={ev => this.onLogin(ev)}><h3>{this.text}</h3></StateButton>
            <div class="flex-div"/>

            {this.makeFooter()}
        </div>
    }

    protected makeNode() {
        return <form class="fill center">
            {this.container}
        </form>
    }

    protected onLogin(ev: Event) {
        ev.preventDefault()
        if (this.updateInputFail() || !this.preDispatch()) return void this.updateInputFail()
        this.dispatch()
        this.updateInputFail()
    }

    protected reportPasswordTooShort() {
        return this.passwordInput.input.value.length < this.minPasswordLen
            && (this.passwordInput.setError("Password is too short"), true)
    }

    protected preDispatch(): boolean[] {
        return [this.reportPasswordTooShort()]
    }

    protected dispatch() {
        this.props.onLogin?.(this, this.emailInput.input.value, this.passwordInput.input.value)
    }
}

export interface LoginOpts {
    onLogin?: (self: Login, email: string, password: string) => void
    onSwitch?: () => void
    minPasswordLen?: number
}
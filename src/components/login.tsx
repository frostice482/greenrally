import BComp from "./bcomp"
import UInput from "./uinput"
import { StateButton } from "./util"

export default class Login<T extends LoginOpts = LoginOpts> extends BComp<T> {
    constructor(props: T) {
        super(props)
        this.beforeRender()
        this.container = this.makeContainer()
        this.node = this.makeNode()
    }

    protected text = "Login"

    container
    node
    emailInput = new UInput(<input required id="username" type="text"/>, "Email")
    passwordInput = new UInput(<input required id="password" type="password"/>, "Password")

    protected fields = [this.emailInput, this.passwordInput]

    protected makeFooter() {
        return <small class="flex-row justify-between fill-x">
            <span>Don't have an account?</span>
            <a onClick={this.props.onSwitch}>Sign up</a>
        </small>
    }

    protected makeContainer() {
        return <div class="login-container flex-col align-center">
            <h2>{this.text}</h2>
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
        this.props.onLogin?.(this, this.emailInput.input.value, this.passwordInput.input.value)
    }

    render() {
        return this.node
    }
}

export interface LoginOpts {
    onLogin?: (self: Login, username: string, password: string) => void
    onSwitch?: () => void
}
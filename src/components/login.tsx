import { nodeState } from "lib/state";
import BComp from "./bcomp";
import XInput from "./xinput";
import { Button } from "./util";

export default class Login extends BComp<LoginOptions> {
    constructor(opts: LoginOptions) {
        super(opts)
    }
    title = 'Login'

    inputEmail = new XInput(<input name="email" type="email" required/>, 'Email')
    inputPassword = new XInput(<input name="password" type="password" required minLength={6}/>, 'Password')
    inputs = [this.inputEmail, this.inputPassword]
    formNode = nodeState<HTMLFormElement>()

    protected makeFooter() {
        return <small class="fill-x">
            Don't have an account?
            <a class="right" onClick={() => this.props.onSwitch?.()}>Register</a>
        </small>
    }

    protected makeForm() {
        return <form id="login-form" class="login-container container-large" onSubmit={ev => ev.preventDefault()}>
            <h1>{this.title}</h1>
            <div class="fill-x">{this.inputs.map(v => v.node())}</div>
            <Button onClick={ev => this.onSubmit(ev)}>{this.title}</Button>
            {this.makeFooter()}
        </form> as E.form
    }

    protected makeNode() {
        this.formNode(this.makeForm())

        return <div class="center fill">
            {this.formNode()}
        </div>
    }

    protected onSubmit(ev: Event) {
        for (const input of this.inputs) input.update()
        if (this.inputs.some(v => v.input.validationMessage)) return

        this.props.onSubmit?.(new FormData(this.formNode()))
    }
}

export interface LoginOptions {
    onSwitch?: () => void
    onSubmit?: (formdata: FormData) => void
}

import Login, { LoginOpts } from "./login"
import UInput from "./uinput"

export default class Register<T extends LoginOpts = LoginOpts> extends Login<T> {
    constructor(props: T) {
        super(props)
    }

    declare confirmPasswordInput: UInput
    declare nameInput: UInput

    protected beforeRender() {
        super.beforeRender()
        this.text = "Register"
        this.nameInput = new UInput(<input required id="username" type="search"/>, "Username")
        this.confirmPasswordInput = new UInput(<input required id="passwordConfirm" type="password"/>, "Confirm password")
        this.fields = [this.nameInput, this.emailInput, this.passwordInput, this.confirmPasswordInput]
    }

    protected makeFooter() {
        return <small class="flex-row justify-between fill-x">
            <span>Already have an account?</span>
            <a onClick={this.props.onSwitch}>Login</a>
        </small>
    }
}
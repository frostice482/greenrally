import Login, { LoginOpts } from "./login"
import UInput from "./uinput"

export default class Register<T extends RegisterOpts = RegisterOpts> extends Login<T> {
    constructor(props: T) {
        super(props)

        this.minNameLength = props.minNameLength || 6

        this.nameInput.input.addEventListener("change", () => {this.reportNameTooShort() })
        this.confirmPasswordInput.input.addEventListener("change", () => {this.reportPasswordMismatch() })
    }

    declare confirmPasswordInput: UInput
    declare nameInput: UInput
    minNameLength

    protected beforeRender() {
        super.beforeRender()
        this.text = "Register"
        this.nameInput = new UInput(<input required id="username" type="search"/>, "Username")
        this.confirmPasswordInput = new UInput(<input required id="passwordConfirm" type="password"/>, "Confirm password")
        this.fields = [this.nameInput, this.emailInput, this.passwordInput, this.confirmPasswordInput]
    }

    protected makeFooter() {
        return <small class="fill-x">
            Already have an account?
            <a class="right" onClick={this.props.onSwitch}>Login</a>
        </small>
    }

    protected reportNameTooShort() {
        return this.nameInput.input.value.length < this.minNameLength
            && (this.nameInput.setError("Name is too short"), true)
    }

    protected reportPasswordMismatch() {
        return this.confirmPasswordInput.input.value !== this.passwordInput.input.value
            && (this.confirmPasswordInput.setError("Password doesn't match"), true)
    }

    protected preDispatch() {
        return [...super.preDispatch(), this.reportNameTooShort(), this.reportPasswordTooShort(), this.reportPasswordMismatch()]
    }

    protected dispatch() {
        this.props.onRegister?.(this, this.emailInput.input.value, this.nameInput.input.value, this.passwordInput.input.value)
    }
}

export interface RegisterOpts extends LoginOpts {
    onLogin?: undefined
    onRegister?: (self: Register, email: string, username: string, password: string) => void
    minNameLength?: number
}
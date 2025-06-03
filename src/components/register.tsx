import XInput from "./lib/xinput";
import Login from "./login";

export default class Register extends Login {
    title = 'Register'

    inputName = new XInput(<input name="name" type="text" required minLength={6}/>, 'Name')
    inputPasswordConf = new XInput(<input name="passwordConfirm" type="password" required/>, 'Confirm Password', (v) => {
        if (this.inputPassword.input.value !== v) return 'Password does not match'
        return ''
    })
    inputs = [this.inputName, this.inputEmail, this.inputPassword, this.inputPasswordConf]

    protected makeForm() {
        const f = super.makeForm()
        f.id = 'register-form'
        return f
    }

    protected makeFooter() {
        return <small class="fill-x">
            Already have an account?
            <a class="right" onClick={() => this.props.onSwitch?.()}>Login</a>
        </small>
    }
}
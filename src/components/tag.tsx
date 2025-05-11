import { jsx, JSX } from "jsx-dom/jsx-runtime"

export default function Tag(opts: TagOptions) {
    const {name, ...btn} = opts

    const elm = jsx("button", btn)
    if (!elm.childElementCount) elm.append(name)
    elm.classList.add("rally-tag")
    elm.classList.add("focuseffect")
    return elm
}

type btn = JSX.IntrinsicElements['button']

export interface TagOptions extends btn {
    name: string
}
import { jsx, JSX } from "jsx-dom/jsx-runtime"

export default function Tag(opts: TagOptions) {
    const {name, ...btn} = opts

    const elm = jsx("button", btn)
    elm.append(name)
    elm.classList.add("tag")
    return elm
}

type btn = JSX.IntrinsicElements['button']

export interface TagOptions extends btn {
    name: string
}
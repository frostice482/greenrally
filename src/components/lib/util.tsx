import { VData } from "data";
import { jsx } from "jsx-dom/jsx-runtime";
import userUrl from "/user.svg?url"
import userDarkUrl from "/user-dark.svg?url"

export function RallyTag(opts: { name: string } & O.div) {
    const elm = jsx('button', opts)
    elm.classList.add('rally-tag')
    elm.append(String(opts.name).charAt(0).toUpperCase() + opts.name.slice(1));
    return elm
}

export function UserIcon(opts: UserOptions & O.button) {
    const user = opts.user
    const elm = <button {...opts}>
        <Avatar dark={opts.dark} src={user.pictureLink} width={opts.avatarWidth} height={opts.avatarHeight}/>
        {opts.children ? <span>{user.name}</span> : user.name}
        {opts.children}
    </button>
    elm.classList.add('flex-aa')
    return elm
}

export function Image(opts: ImageContainerOptions & O.img) {
    const elm = jsx('img', opts)
    const w = opts.width ?? opts.height ?? '1.25em'
    const h = opts.height ?? opts.width ?? w

    elm.classList.add('fill')
    elm.style.setProperty('--w', w)
    elm.style.setProperty('--h', h)

    return elm
}

export function Button(opts: ButtonOptions & O.button) {
    const elm = jsx('button', opts)
    if (!opts.nostyle) elm.classList.add(opts.hollow ? 'bhx' : 'bx')
    if (opts.size !== 'none') elm.classList.add(buttonSizeOpts[opts.size ?? 'm'])
    return elm
}

const buttonSizeOpts: Record<ButtonSizeOpts, string> = {
    s: 'container-small',
    m: 'container',
    l: 'container-large',
    none: '',
    x: 'container-xsmall'
}

export function Discardable(opts: DiscardableOptions & O.div) {
    const btn = jsx('button', opts.buttionOpions ?? {})
    btn.append('x')

    const r = jsx('span', opts)
    r.append(btn)
    r.classList.add('discardable')

    return r
}

export function Avatar(opts: AvatarOptions & O.img) {
    opts.src ||= opts.dark ? userDarkUrl : userUrl
    const elm = jsx(Image, opts)
    elm.classList.add('avatar')
    return elm
}

export interface AvatarOptions extends ImageContainerOptions {
    dark?: boolean
    src: string
}

export interface DiscardableOptions {
    buttionOpions?: O.button
}

export type ButtonSizeOpts = 's' | 'm' | 'l' | 'x' | 'none'

export interface ButtonOptions {
    nostyle?: boolean
    hollow?: boolean
    size?: ButtonSizeOpts
}

export interface ImageContainerOptions {
    width?: string
    height?: string
}

export interface UserOptions {
    user: VData.User,
    dark?: boolean
    avatarWidth?: string
    avatarHeight?: string
}

import { jsx } from "jsx-dom/jsx-runtime"
import { CustomHTMLElement } from "lib/custom_elm"
import "lib/custom_elm"

export default function Hook(opts: HookOptions & O) {
    const { onConnect, onDisconnect, onMove, onAdopted, onAttrChange, ...elmOpts } = opts

    const elm = jsx('custom-element', elmOpts) as CustomHTMLElement
    elm.onConnect = onConnect
    elm.onDisconnect = onDisconnect
    elm.onMove = onMove
    elm.onAdopted = onAdopted
    elm.onAttrChange = onAttrChange

    return elm
}

export interface HookOptions {
    onConnect?: () => void
    onDisconnect?: () => void
    onMove?: () => void
    onAdopted?: () => void
    onAttrChange?: (name: string, oldValue: string, newValue: string) => void
}
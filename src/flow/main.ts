import { VData } from "data"
import { componentState } from "lib/state"
import TypedEventTarget from "lib/typedevt"
import urlLoader, { URLLoaderBinding, URLLoaderConfiguration } from "lib/urlloader"
import { createProxyURLSearchObj } from "lib/util"

export class MainFlow<R extends RoutesType = MainRoutes> extends TypedEventTarget<MainFlowEvents<R>> {
    routeEvent = new TypedEventTarget<MainFlowExecEventMap<R>>()
    contentNode = componentState()

    define<K extends keyof R>(route: K & string, cb: CB<R[K]>, reqParams: string[]) {
        const conf = urlLoader.addBind(route, reqParams, data => cb(data as never, conf, new URL(data.__originUrl!, location.origin)))
        return conf
    }

    exec<K extends keyof R>(route: K & string, params: R[K]) {
        const org = location.hash
        const url = new URL(route, location.origin)
        const search = url.searchParams
        for (const [k, v] of Object.entries(params)) search.set(k, v)

        const conf = urlLoader.find(url)
        if (!conf) return
        if (conf.requiredParams.some(v => !search.has(v))) return

        urlLoader.pushState(url.pathname, search)
        search.set('__originUrl', org.slice(1))
        conf.fn(createProxyURLSearchObj(search))

        const ev = { conf, route, params }
        this.dispatchEvent(new CustomEvent('exec', {detail: ev}))
        this.routeEvent.dispatchEvent(new CustomEvent(route, { detail: ev }))

        return conf
    }
}

const flow = new MainFlow()
export default flow

type CB<Data> = (data: Data, bind: URLLoaderBinding, origin: URL) => void

export interface MainFlowEvents<R> {
    exec: MainFlowExecEventMap<R>[keyof R]
    login: VData.User
    logout: void
}

interface ExeecEvent<A, B> {
    readonly conf: URLLoaderConfiguration
    readonly route: A
    readonly params: B
}

type MainFlowExecEventMap<R> = { [K in keyof R]: ExeecEvent<K, R[K]> }

declare global {
    type RoutesType = { [route: string]: { [prop: string]: string } }

    interface MainRoutes extends RoutesType {}
}
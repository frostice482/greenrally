import { createProxyURLSearchObj } from "./util"

export class URLLoader {
	paths = new Map<string, URLLoaderConfiguration>()
	regexs = new Map<RegExp, URLLoaderConfiguration>()

	add<R extends string>(path: string | RegExp, requiredParams: readonly R[], fn: Fn<R>) {
		return this.addConfig({ path, requiredParams, fn })
	}

	addConfig(conf: URLLoaderConfiguration) {
		if (typeof conf.path === 'string') this.paths.set(conf.path, conf)
		else this.regexs.set(conf.path, conf)
		return conf
	}

	removeConfig(confOrPath: URLLoaderConfiguration | string | RegExp) {
		if (typeof confOrPath === 'object' && 'path' in confOrPath) confOrPath = confOrPath.path

		if (typeof confOrPath === 'string') return this.paths.delete(confOrPath)
		else return this.regexs.delete(confOrPath)
	}

	find(url: string | URL) {
		if (!(url instanceof URL)) url = new URL(url, location.origin)
		const path = url.pathname

		const p = this.paths.get(path)
		if (p) return p

		for (const [regex, conf] of this.regexs)
			if (regex.test(path)) return conf
	}

	exec(url: string | URL, search?: URLSearchParamsInit) {
		if (!(url instanceof URL)) url = new URL(url, location.origin)

		const conf = this.find(url)
		if (!conf) return

		search = search instanceof URLSearchParams ? search : search ? new URLSearchParams(search) : url.searchParams
		if (conf.requiredParams.some(v => !search.has(v))) return

		conf.fn(createProxyURLSearchObj(search))
		return conf
	}
}

export class URLLoaderBinding<R extends string = string> {
	constructor(url: string, parent: URLLoaderDefault) {
		this.parent = parent
		this.url = url
	}

	parent: URLLoaderDefault
	url: string

	push(args?: ReadonlyRecord<R, string> & ReadonlyRecord<string, string>, push = true) {
		this.parent.pushState(this.url, args, push)
	}
}

export class URLLoaderDefault extends URLLoader {
	shouldPush = false

	addBind<R extends string>(url: string, requiredParams: readonly R[], fn: Fn<R>) {
		this.addConfig({ path: url, requiredParams, fn })
		return new URLLoaderBinding<R>(url, this)
	}

	/**
	 * Pushes URL state
	 * @param url URL
	 * @param args URL Args
	 * @returns
	 */
	pushState(url: string, args: URLSearchParamsInit = '', push = true) {
		if (args && !(args instanceof URLSearchParams)) args = new URLSearchParams(args)
		let argsStr = args.toString()
		if (argsStr) argsStr = '?' + argsStr

		const target = '#' +  url + argsStr

		if (push && this.shouldPush) {
			console.debug('<url:push>', target)
			if (location.hash !== target)
				history.pushState(null, '', target)
		}
		else {
			console.debug('<url:replace>', target)
			history.replaceState(null, '', target)
			this.shouldPush = true
		}
	}
}

const urlLoader = new URLLoaderDefault()
export default urlLoader

export interface URLLoaderConfiguration {
	path: string | RegExp
	requiredParams: readonly string[]
	fn: Fn
}

type Fn<R extends string = never> = (obj: Record<string, string> & Record<R, string>) => void
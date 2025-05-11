import { createProxyURLSearchObj } from "./util"

export class URLLoader {
	paths = new Map<string, Configuration>()
	regexs = new Map<RegExp, Configuration>()

	add<R extends string>(path: string | RegExp, requiredParams: readonly R[], fn: Fn<R>) {
		return this.addConfig({ path, requiredParams, fn })
	}

	addConfig(conf: Configuration) {
		if (typeof conf.path === 'string') this.paths.set(conf.path, conf)
		else this.regexs.set(conf.path, conf)
		return conf
	}

	removeConfig(confOrPath: Configuration | string | RegExp) {
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

	exec(url: string | URL) {
		if (!(url instanceof URL)) url = new URL(url, location.origin)

		const conf = this.find(url)
		if (!conf) return false

		const search = url.searchParams
		for (const p of conf.requiredParams)
			if (!search.has(p)) return false

		conf.fn(createProxyURLSearchObj(search))
		return true
	}
}

export class URLLoaderDefaultState<R extends string> {
	constructor(ref: URLLoaderDefault, conf: ConfigurationString) {
		this.ref = ref
		this.config = conf
	}

	ref: URLLoaderDefault
	config: ConfigurationString

	push(args?: Record<R, string> | Record<string, string>, push = true) {
		this.ref.pushState(this.config.path, args, push)
	}
}

export class URLLoaderDefault extends URLLoader {
	shouldPush = false

	addState<R extends string>(path: string, requiredParams: readonly R[], fn: Fn<R>) {
		const confStr: ConfigurationString = { path, requiredParams, fn }
		this.addConfig(confStr)
		return new URLLoaderDefaultState<R>(this, confStr)
	}

	/**
	 * Pushes URL state
	 * @param url URL
	 * @param args URL Args
	 * @returns
	 */
	pushState(url: string, args?: URLSearchParamsInit, push = true) {
		if (!(args instanceof URLSearchParams)) args = new URLSearchParams(args)
		const target = '#' +  url + '?' + args

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

interface Configuration {
	path: string | RegExp
	requiredParams: readonly string[]
	fn: Fn
}

interface ConfigurationString extends Configuration {
	path: string
}

type Fn<R extends string = never> = (obj: Record<string, string> & Record<R, string>) => void
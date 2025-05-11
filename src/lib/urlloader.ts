export class URLLoader {
	static createProxyURLSearchObj(search: URLSearchParams): Record<string, string> {
		return new Proxy({}, {
			get(t, p) {
				if (typeof p === 'string') return search.get(p) ?? undefined
			},
			set(t, p, v) {
				if (typeof p !== 'string') return true

				if (v == undefined) search.delete(p)
				else search.set(p, v)

				return true
			},
			deleteProperty(t, p) {
				if (typeof p === 'string') search.delete(p)
				return true
			},
			has(t, p) {
				return typeof p === 'string' && search.has(p)
			}
		})
	}

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

		conf.fn(URLLoader.createProxyURLSearchObj(search))
		return true
	}
}

export class URLLoaderDefault extends URLLoader {
	shouldPush = false

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

type Fn<R extends string = never> = (obj: Record<string, string> & Record<R, string>) => void
//@ts-check

const storage = navigator.storage.getDirectory()
const localPrefix = '/local/'

addEventListener("activate", ev => {
    ev.waitUntil(clients.claim())
})

addEventListener("fetch", async ev => {
    /** @type {Request} */
    const req = ev.request
    const url = new URL(req.url)

    if (url.pathname.startsWith(localPrefix)) {
        const x = handleLocal(req)
        ev.respondWith(x.catch(e => new Response(String(e), { status: 500 })))
        return
    }
})

/**
 * @param {Request} req
 */
async function handleLocal(req) {
    const url = new URL(req.url)
    const localUrl = convertURL(url.pathname)

    switch (req.method) {
        case 'GET': {
            if (url.searchParams.get('entries') === 'true') {
                return handleLocalGetEntries(localUrl)
            }
            return handleLocalGet(localUrl)
        } break;

        case 'POST': {
            return handleLocalWrite(req, localUrl)
        } break;

        case 'PUT': {
            return handleLocalWrite(req, localUrl, true)
        } break;

        case 'DELETE': {
            return handleLocalDelete(req, localUrl)
        } break;

        default:
            return notFound()
    }
}

/**
 * @param {string} url
 */
async function handleLocalGet(url) {
    const h = await getHandle(url, undefined, false)
    if (!h) return notFound()

    const f = await h.getFile()
    return new Response(f)
}

/**
 * @param {string} url
 */
async function handleLocalGetEntries(url) {
    const h = await getDirectoryHandle(parseURL(url))
    if (!h) return Response.json([], { status: 404 })

    const entries = []
    for await (const entry of h.keys()) {
        entries.push(entry)
    }

    return Response.json(entries, { status: 200 })
}

/**
 * @param {Request} req
 * @param {string} url
 */
async function handleLocalWrite(req, url, append = false) {
    const h = await getHandle(url, undefined, true)
    if (!h) return notFound()

    const wstr = await h.createWritable({ keepExistingData: append })
    const blob = await req.blob()
    const rstr = await blob.stream()
    rstr.pipeTo(wstr)

    return new Response('')
}

/**
 * @param {string} url
 */
async function handleLocalDelete(req, url) {
    const dirNames = parseURL(url)
    const fileName = dirNames.pop()
    if (!fileName) return new Response('Cannot parse filename', { status: 400 })
    const d = await getDirectoryHandle(dirNames)
    if (!d) return  notFound()

    await d.removeEntry(fileName, { recursive: true })

    return new Response('')
}

/**
 * @param {string[]} directories
 * @param {FileSystemDirectoryHandle | Promise<FileSystemDirectoryHandle>} [root]
 */
async function getDirectoryHandle(directories, root = storage, create = true) {
    let dirHandle = await root
    for (const dir of directories) {
        try {
            dirHandle = await dirHandle.getDirectoryHandle(dir, { create: create })
        } catch(e) {
            if (e instanceof Error && e.name === 'NotFoundError') return
            throw e
        }
    }
    return dirHandle
}

/**
 * @param {string} url
 * @param {FileSystemDirectoryHandle | Promise<FileSystemDirectoryHandle>} [root]
 */
async function getHandle(url, root = storage, create = true) {
    const dirNames = parseURL(url)
    const fileName = dirNames.pop()
    if (!fileName) return

    const dirHandle = await getDirectoryHandle(dirNames, root)
    if (!dirHandle) return

    try {
        const fileHandle = await dirHandle.getFileHandle(fileName, { create: create })
        return fileHandle
    } catch(e) {
        if (e instanceof Error && e.name === 'NotFoundError') return
        if (e === undefined) return
        throw e
    }
}

async function notFound() {
    return new Response('', { status: 404 })
}

/**
 * @param {string} url
 */
function convertURL(url) {
    return 'greenrally/' + url.slice(localPrefix.length)
}

/**
 * @param {string} url
 */
function parseURL(url) {
    const x = []
    const paths = url.split('/')
    for (const path of paths) {
        switch (path) {
            case '.':
            case '':
                break;

            case '..':
                x.pop()
                break;

            default:
                x.push(path)
        }
    }
    return x
}

import data from "data"
import flow from "./main"
import RallyEdit, { RallyEditData } from "components/rally_edit"
import { sleep } from "lib/util"

let create: RallyEdit | undefined

flow.define('/edit', async ({id}) => {
    if (!data.currentLogin) return flow.exec('/login', {})
    let rally
    if (id) {
        rally = data.rallies.get(id)
        if (!rally || data.currentLogin !== rally.author) return
    }

    create ??= new RallyEdit({ onPost: onEditPost })
    flow.contentNode(create)

    if (rally) {
        let conf = !create.hasData()
        if (!conf) {
            await sleep(50) // wait for node to render
            conf = confirm('Discard previous edit?')
        }
        if (!conf) return

        create.editFrom(rally)
        flow.contentNode(create)

        document.title = `Edit | GreenRally`
    }
    else {
        document.title = `Create | GreenRally`
    }
}, [])

async function onEditPost(post: RallyEditData) {
    const assign = {
        title: post.title,
        description: post.description,
        startTime: post.startDate.getTime(),
        endTime: post.endDate.getTime(),
        tags: post.tags,
        isActivity: post.rallyType === 'activity'
    }
    let rally
    if (post.currentEditId) {
        rally = data.rallies.get(post.currentEditId)
        if (!rally) return create?.errmsg('Unknown rally ' + post.currentEditId)
        if (rally.author !== data.currentLogin) return create?.errmsg('Unauthorized')

        data.search.removeRally(rally)
        Object.assign(rally, assign)
        data.search.addRally(rally)
    } else {
        if (!data.currentLogin) return create?.errmsg('Unauthorized')
        rally = await data.createRally({ author: data.currentLogin.id, ...assign })
    }

    create = undefined
    data.save()
    flow.exec('/rally', { id: rally.id })
    alert(post.currentEditId ? "Edit successful" : "Successfully created a new rally")
}

self.addEventListener('beforeunload', ev => {
    if (create?.hasData()) ev.preventDefault()
})

declare global {
    interface MainRoutes {
        '/edit': {
            id?: string
        }
    }
}

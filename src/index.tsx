import RallyList from "components/list"
import Popup from "components/popup"
import RallyInfo from "components/rallyinfo"
import SHeader from "components/super/header"
import data from "defaultdata"

const list = new RallyList({
    rallies: data.rallies.values(),
    onRallyInfoClick: rally => showInfo(rally)
})

const header = new SHeader({
    rallies: Array.from(data.rallies.values()),
    onRallyClick: rally => {
        showInfo(rally)
        header.searchPopup.hide()
    }
})

function showInfo(id: string | Data.Rally) {
    if (typeof(id) === 'string') {
        const rally = data.rallies.get(id)
        if (!rally) return
        id = rally
    }

    const popup = new Popup(<RallyInfo rally={id} onTagClick={tag => {
        popup.hide()
        list.selectTag(tag, true)
    }}/>, { blur: true, center: true })

    requestAnimationFrame(() => document.body.append(popup.show()))
}

document.body.append(header.render())

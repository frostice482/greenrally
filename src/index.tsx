import RallyList from "components/list"
import Popup from "components/popup"
import RallyInfo from "components/rallyinfo"
import SHeader from "components/super/header"
import data from "defaultdata"

document.head.append(
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Merienda:wght@300..900&family=Open+Sans:wght@300..800&display=swap"/>
)

document.body.append(<SHeader rallies={Array.from(data.rallies.values())} onRallyClick={console.log}/>)

const popup = new Popup(<RallyInfo rally={data.rallies.values().next().value}/>, { blur: true, center: true })
popup.show()

document.body.append(popup.node)


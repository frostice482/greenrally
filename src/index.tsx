import CHeader from "./components/header"
import data from "./defaultdata"
import PList from "./page/list"

document.head.append(
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Merienda:wght@300..900&family=Open+Sans:wght@300..800&display=swap"/>
)

document.body.append(<CHeader/>)
document.body.append(<PList rallies={data.rallies.values()}/>)

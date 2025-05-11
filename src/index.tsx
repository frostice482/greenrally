import CHeader from "./components/header"
import CRally from "./components/rally"
import data from "./defaultdata"

document.head.append(
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Merienda:wght@300..900&family=Open+Sans:wght@300..800&display=swap"/>
)

document.body.append(<CHeader/>)

for (const rally of data.rallies.values()) {
    document.body.append(<CRally rally={rally}/>)
}

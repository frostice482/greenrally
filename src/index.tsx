import Header from "./components/header"
import Register from "./components/register"

document.head.append(
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Merienda:wght@300..900&family=Open+Sans:wght@300..800&display=swap"/>
)

document.body.append(<Header/>)
document.body.append(<Register/>)

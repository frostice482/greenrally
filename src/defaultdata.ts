import Data from "data";

const lipsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
const lipsumLong = lipsum + ", sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

const data = new Data
data.loadJSON({
    rallies: [
        ["1", {
            id: "1",
            name: "Penanaman pohon di Daerah Antariksa",
            description: lipsumLong,
            author: "dummy",
            startTime: Date.now(),
            endTime: Date.now() + 3600 * 24 * 1000,
            participants: ["dummy"],
            tags: ["pohon", "antariksa"],
            backgroundLink: "https://www.snexplores.org/wp-content/uploads/2020/04/1030_LL_trees-1028x579.png"
        }],
        ["2", {
            id: "2",
            name: "Pembersihan sampah di sekitar sungai Antariksa",
            description: lipsumLong,
            author: "dummy",
            startTime: Date.now() - 3600 * 24 * 1000,
            endTime: Date.now() - 3600 * 12 * 1000,
            participants: ["dummy"],
            tags: ["sampah", "sungai", "antariksa"],
            backgroundLink: "https://api2.zoomit.ir/media/plastic-pollution-640d8c62fc5aadb2f1705d0b"
        }],
        ["3", {
            id: "3",
            name: "Pengelolaan sampah Karbon",
            description: lipsumLong,
            author: "dummy",
            startTime: Date.now() + 3600 * 15 * 24 * 1000,
            endTime: Date.now() + 3600 * 18 * 24 * 1000,
            participants: ["dummy"],
            tags: ["karbon", "sampah"],
            backgroundLink: "https://cff2.earth.com/uploads/2018/12/05120107/Global-CO2-emissions-expected-to-hit-an-all-time-high-in-2018.jpg"
        }],
        ["4", {
            id: "4",
            name: "Pengelolaan sampah Plastik",
            description: lipsumLong,
            author: "dummy",
            startTime: Date.now() - 3600 * 3 * 24 * 1000,
            endTime: Date.now() + 3600 * 6 * 24 * 1000,
            participants: ["dummy"],
            tags: ["plastik", "sampah"],
            backgroundLink: "https://www.purdue.edu/uns/images/2019/plastics-debris.jpg"
        }],
        ["5", {
            id: "5",
            name: "Pengelolaan sampah organik",
            description: lipsumLong,
            author: "dummy",
            startTime: Date.now() - 3600 * 24 * 1000,
            endTime: Date.now() - 3600 * 12 * 1000,
            participants: ["dummy"],
            tags: ["organik", "sampah"],
            backgroundLink: "https://www.zerowasteeurope.eu/wp-content/uploads/2014/10/organic-waste.jpg"
        }],

    ],
    users: [
        ["dummy", {
            id: "dummy",
            name: "sugoma",
            aboutMe: lipsumLong,
            email: "dummy@example.com",
            password: "\0\b\r\t\v\n\f",
            profileLink: "",
            recentRallies: ["1"]
        }]
    ]
})
data.load()

export default data
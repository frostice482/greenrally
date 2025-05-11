import Data from "data";

const lipsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
const lipsumLong = lipsum + ", sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

const data = new Data
data.loadJSON({
    rallies: [
        ["1", {
            id: "1",
            name: lipsum,
            description: lipsumLong,
            author: "dummy",
            startTime: Date.now(),
            endTime: Date.now() + 3600 * 24 * 1000,
            participants: ["dummy"],
            tags: ["tag1", "tag2"],
            backgroundLink: "https://www.snexplores.org/wp-content/uploads/2020/04/1030_LL_trees-1028x579.png"
        }]
    ],
    users: [
        ["dummy", {
            id: "dummy",
            name: lipsum,
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
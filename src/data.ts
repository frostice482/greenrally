import JSONStore from "lib/jsonstore"
import RallySearchList from "./search"
import Encoding from "lib/encoding"

export class VData extends JSONStore<DataJson.Root> {
    users = new Map<string, VData.User>()
    usersByName = new Map<string, VData.User>()
    usersByEmail = new Map<string, VData.User>()
    rallies = new Map<string, VData.Rally>()
    currentLogin?: VData.User

    search = new RallySearchList()

    randomId() {
        return Math.random().toString(36).slice(2)
    }

    register(email: string, username: string, password: string, login = false) {
        const user: VData.User = {
            id: this.randomId(),
            email: email,
            name: username,
            password: password,
            hasEmailVerified: false,
            isCoordinator: true,
            aboutMe: '',
            pictureLink: '',
            recentRallies: []
        }

        this.addUser(user)
        if (login) this.currentLogin = user
        return user
    }

    async uploadLocalHash(blob: Blob) {
        const hashBuf = crypto.subtle.digest('sha-256', await blob.arrayBuffer())
        const hash = Encoding.toHex(await hashBuf)

        const url = new URL('/local/greenrally/'+hash, location.origin)
        fetch(url, { method: 'POST', body: blob })

        return url.href
    }

    async createRally(opts: VData.CreateRallyOptions) {
        const picLinks = !opts.files ? [] : Promise.all(opts.files.map(v => this.uploadLocalHash(v)))
        delete opts.files

        const r: VData.Rally = {
            ...opts,
            id: this.randomId(),
            author: this.users.get(opts.author)!,
            //coordinators: new Map,
            members: new Map,
            forums: new Map,
            pictureLinks: await picLinks
        }

        this.rallies.set(r.id, r)
        this.search.addRally(r)
        return r
    }

    login(email: string, password: string) {
        const user = this.usersByEmail.get(email)
        if (!user || user.password !== password) return
        this.currentLogin = user
        return user
    }

    changeName(user: VData.User | string, name: string) {
        if (typeof user === 'string') {
            const u = this.usersByName.get(user)
            if (!u) return
            user = u
        }

        this.usersByName.delete(user.name)
        user.name = name
        this.usersByName.set(name, user)
    }

    changeEmail(user: VData.User | string, email: string) {
        if (typeof user === 'string') {
            const u = this.usersByEmail.get(user)
            if (!u) return
            user = u
        }

        this.usersByEmail.delete(user.email)
        user.email = email
        this.usersByEmail.set(email, user)
    }

    addUser(user: VData.User) {
        this.users.set(user.id, user)
        this.usersByName.set(user.name, user)
        this.usersByEmail.set(user.email, user)
    }

    userToJson(user: VData.User): DataJson.User {
        return {
            ...user,
            recentRallies: user.recentRallies.map(v => v.id)
        }
    }

    rallyToJson(rally: VData.Rally): DataJson.Rally {
        return {
            ...rally,
            author: rally.author.id,
            //coordinators: Array.from(rally.coordinators.values(), v => v.id),
            members: Array.from(rally.members.values(), v => v.id),
            forums: Array.from(rally.forums.values(), v => this.rallyForumToJson(v))
        }
    }

    rallyForumToJson(rallyForum: VData.Forum): DataJson.Forum {
        return {
            ...rallyForum,
            author: rallyForum.author.id,
            replies: rallyForum.replies.map(v => ({
                ...v,
                author: v.author.id
            }))
        }
    }

    toJSON(): DataJson.Root {
        return {
            users: Array.from(this.users.values(), v => this.userToJson(v)),
            rallies: Array.from(this.rallies.values(), v => this.rallyToJson(v)),
            currentLogin: this.currentLogin?.id,
        }
    }

    loadJSON(data: DataJson.Root): void {
        const { users, rallies } = this
        users.clear()
        rallies.clear()
        this.usersByName.clear()
        this.usersByEmail.clear()

        for (const user of data.users) {
            this.addUser(user as never)
        }

        for (const rally of data.rallies) {
            this.rallies.set(rally.id, rally as never)
        }

        for (const user of users.values()) {
            const x = user as unknown as DataJson.User
            user.recentRallies = x.recentRallies.map(v => rallies.get(v)!)
        }

        for (const rally of rallies.values()) {
            const x = rally as unknown as DataJson.Rally
            //rally.coordinators = new Map(x.coordinators.map(v => [v, users.get(v)!]))
            rally.members = new Map(x.members.map(v => [v, users.get(v)!]))
            rally.author = users.get(x.author)!

            const rallyForums = new Map
            for (const xforum of x.forums as any) {
                xforum.author = users.get(xforum.author)
                for (const reply of xforum.replies) {
                    reply.author = users.get(reply.author)
                }
                rallyForums.set(xforum.id, xforum)
            }
            rally.forums = rallyForums
        }

        this.currentLogin = data.currentLogin ? users.get(data.currentLogin) : undefined

        this.search.list = new Set(this.rallies.values())
        this.search.updateAll()
    }
}

const data = new VData(localStorage, 'data')
if (!data.load()) {
    const ai =
`Reducing your **carbon footprint** (the total greenhouse gas emissions caused by your activities) is essential to combat climate change. Here are practical ways to lower your impact:

### **1. Transportation**
- **Walk, bike, or use public transport** instead of driving.
- **Carpool** to reduce emissions per person.
- **Switch to an electric or hybrid vehicle** if possible.
- **Limit air travel** (or choose direct flights and carbon offsets).

### **2. Energy Use at Home**
- **Switch to renewable energy** (solar, wind, or green energy providers).
- **Use energy-efficient appliances** (look for ENERGY STAR labels).
- **Unplug devices** when not in use (phantom energy waste).
- **Lower heating/cooling** by adjusting thermostats (1°C change saves ~5% energy).
- **Insulate your home** to reduce heating/cooling needs.

### **3. Diet & Food Choices**
- **Eat less meat** (especially beef & lamb—livestock emits methane).
- **Choose local & seasonal foods** (reduces transport emissions).
- **Reduce food waste** (compost scraps, plan meals).
- **Avoid single-use plastics** (they’re fossil fuel-based).

### **4. Shopping & Consumption**
- **Buy less, choose sustainable products** (fast fashion & electronics have high footprints).
- **Repair, reuse, recycle** to extend product life.
- **Support eco-friendly brands** with low-carbon practices.

### **5. Water Usage**
- **Take shorter showers** (saves energy used to heat water).
- **Fix leaks** (dripping faucets waste water & energy).
- **Use a water-efficient washing machine/dishwasher.**

### **6. Carbon Offsetting**
- **Plant trees** (they absorb CO₂).
- **Support carbon offset programs** (renewable energy, reforestation).

### **7. Advocate & Educate**
- **Encourage businesses & governments** to adopt green policies.
- **Spread awareness** about climate action.

### **Quick Wins:**
✅ Switch to LED bulbs
✅ Use reusable bags/bottles
✅ Work remotely (if possible)
✅ Eat more plant-based meals

Every small action adds up! Would you like tips tailored to a specific area (home, travel, diet)? 😊`

    const andrewId = '1'
    const morioId = '2'
    const evanId = '3'
    const alvistId = '4'
    const darrelId = '5'
    const oneHour = 60 * 60 * 1000
    const oneDay = 24 * oneHour
    const oneWeek = 7 * oneDay
    const now = Date.now()

    const lipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi efficitur lorem sit amet elit pretium vehicula. Curabitur suscipit semper tellus, id semper nulla. Nam volutpat diam vel mi convallis viverra. Proin sed condimentum felis. Donec tortor ante, pharetra et felis at, finibus gravida purus. Pellentesque interdum, arcu vulputate vestibulum elementum, turpis augue laoreet lacus, eu finibus massa odio iaculis arcu. Mauris porta, odio in mattis faucibus, arcu dolor tincidunt dolor, vel tempor eros velit sit amet turpis. Fusce sit amet ultricies diam, non convallis orci. Morbi molestie nisi consequat, rutrum orci a, consectetur quam. '

    data.loadJSON({
        users: [{
            id: andrewId,
            name: 'Andrew',
            email: 'andrew@greenrally',
            password: 'abcdef',
            aboutMe: 'fish',
            hasEmailVerified: true,
            pictureLink: 'https://www.translationdirectory.com/images_articles/god_has_created_this/big/fish_wikimedia_0005_big.jpg',
            recentRallies: ['1'],
            isCoordinator: true,
        }, {
            id: evanId,
            name: 'Evan',
            email: 'evan@greenrally',
            password: 'abcdef',
            aboutMe: 'JavaScript user',
            hasEmailVerified: false,
            pictureLink: '',
            recentRallies: ['1', '2'],
            isCoordinator: true,
        }, {
            id: morioId,
            name: 'Morio',
            email: 'morio@greenrally',
            password: 'abcdef',
            aboutMe: 'PegeLinux',
            hasEmailVerified: true,
            pictureLink: '',
            recentRallies: ['1', '2'],
            isCoordinator: true,
        }, {
            id: alvistId,
            name: 'Alvist',
            email: 'alvist@greenrally',
            password: 'abcdef',
            aboutMe: 'i play roblox',
            hasEmailVerified: true,
            pictureLink: '',
            recentRallies: ['1', '2'],
            isCoordinator: false,
        }, {
            id: darrelId,
            name: 'Darrel',
            email: 'darrel@greenrally',
            password: 'abcdef',
            aboutMe: 'nt bang',
            hasEmailVerified: true,
            pictureLink: '',
            recentRallies: ['2'],
            isCoordinator: false,
        }],
        rallies: [{
            id: '1',
            author: morioId,
            title: 'Reforestation Event by Tree Plantations within Earth',
            description: [
                'Reforestation is the practice of restoring previously existing forests and woodlands that have been destroyed or damaged.',
                'The prior forest destruction might have happened through deforestation, clearcutting or wildfires.',
                'Three important purposes of reforestation programs are for harvesting of wood, for climate change mitigation, and for ecosystem and habitat restoration purposes.',
                'One method of reforestation is to establish tree plantations, also called plantation forests.\n\n',
                lipsum
            ].join('\n'),
            //coordinators: [alvistId, darrelId],
            members: [andrewId, evanId, alvistId],
            isActivity: false,
            startTime: now + oneWeek,
            endTime: now + 2 * oneWeek,
            tags: ['reforestation', 'forest', 'tree', 'planting'],
            pictureLinks: ['sample-sapling.webp'],
            forums: [{
                id: '1',
                author: andrewId,
                title: 'question',
                message: 'where is the location',
                readOnly: false,
                attachments: [],
                time: now - 24 * oneHour,
                replies: [{
                    author: alvistId,
                    time: now - 23 * oneHour,
                    message: 'earth',
                    attachments: []
                }, {
                    author: andrewId,
                    time: now - 22 * oneHour,
                    message: 'yeah but where?',
                    attachments: []
                }, {
                    author: alvistId,
                    time: now - 21 * oneHour,
                    message: 'earth',
                    attachments: []
                }, {
                    author: andrewId,
                    time: now - 20 * oneHour,
                    message: '*cat noises*',
                    attachments: [{
                        type: 'image/jpeg',
                        link: 'https://www.thinksmartgames.com/upload/quiz-2244/what-do-you-know-about-cats.jpg'
                    }]
                }]
            }]
        }, {
            id: '2',
            author: evanId,
            title: 'Activity of Reducing Carbon Emission',
            description: [
                'Greenhouse gas (GHG) emissions from human activities intensify the greenhouse effect.',
                'This contributes to climate change. Carbon dioxide (CO2), from burning fossil fuels such as coal, oil, and natural gas, is the main cause of climate change.'
            ].join('\n'),
            //coordinators: [andrewId, morioId],
            members: [alvistId, darrelId, morioId],
            isActivity: true,
            startTime: 0,
            endTime: 0,
            tags: ['carbon'],
            pictureLinks: ['sample-carbon.webp'],
            forums: [{
                id: '1',
                author: alvistId,
                title: 'how?',
                message: 'How can we reduce carbon footprint?',
                readOnly: false,
                attachments: [],
                time: now - 10 * oneHour,
                replies: [{
                    author: morioId,
                    time: now - 9 * oneHour,
                    message: ai,
                    attachments: []
                }]
            }]
        }, {
            id: '3',
            author: andrewId,
            title: 'Ongoing Event Test',
            description: '',
            members: [],
            isActivity: false,
            startTime: now - oneWeek,
            endTime: now + oneWeek,
            tags: [],
            pictureLinks: [],
            forums: []
        }, {
            id: '4',
            author: andrewId,
            title: 'Outdated Event Test',
            description: '',
            members: [],
            isActivity: false,
            startTime: now - 2 * oneWeek,
            endTime: now -  oneWeek,
            tags: [],
            pictureLinks: [],
            forums: []
        }]
    })
}

export default data

export declare namespace VData {
    interface User extends Omit<DataJson.User, 'recentRallies'> {
        recentRallies: Rally[]
    }

    interface Rally extends Omit<DataJson.Rally, 'author' | 'coordinators' | 'members' | 'forums'> {
        author: User
        //coordinators: Map<string, User>
        members: Map<string, User>
        forums: Map<string, Forum>
    }

    interface CreateRallyOptions {
        author: string
        title: string
        description: string
        startTime: number
        endTime: number
        tags: string[]
        isActivity: boolean
        files?: Blob[]
    }

    interface Forum extends Omit<DataJson.Forum, 'author' | 'replies'> {
        author: User
        replies: ForumReply[]
    }

    interface ForumReply extends Omit<DataJson.ForumReply, 'author'> {
        author: User
    }
}

declare namespace DataJson {
    interface Identified {
        id: string
    }

    interface User extends Identified {
        name: string
        email: string
        password: string
        aboutMe: string
        recentRallies: string[]
        pictureLink: string
        hasEmailVerified: boolean
        isCoordinator: boolean
    }

    interface Rally extends Identified {
        author: string
        title: string
        description: string
        startTime: number
        endTime: number
        //coordinators: string[]
        members: string[]
        tags: string[]
        pictureLinks: string[]
        isActivity: boolean
        forums: Forum[]
    }

    interface ForumMessage {
        time: number
        author: string
        message: string
        attachments: Attachment[]
    }

    interface Forum extends ForumMessage, Identified {
        title: string
        replies: ForumReply[]
        readOnly: boolean
    }

    interface ForumReply extends ForumMessage {}

    interface Attachment {
        type: string
        link: string
    }

    interface Root {
        users: User[]
        rallies: Rally[]
        currentLogin?: string
    }
}

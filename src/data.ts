export default class IData {
    users = new Map<string, Data.User>()
    userByNames = new Map<string, Data.User>()
    userByEmails = new Map<string, Data.User>()
    rallies = new Map<string, Data.Rally>()

    currentLogin?: Data.User

    minPasswordLength = 6

    register(name: string, email: string, password: string) {
        if (this.userByNames.has(name)) return "name.exists"
        if (this.userByEmails.has(email)) return "email.exists"
        if (password.length < this.minPasswordLength) return "password.tooshort"

        const user: Data.User = {
            id: Math.random() + '',
            email: email,
            name: name,
            password: password,
            aboutMe: "",
            profileLink: "",
            recentRallies: []
        }
        this.addUser(user)
        return user
    }

    addRally(author: string | Data.User, data: Data.RallyOptions) {
        const rally: Data.Rally = {
            ...data,
            id: Math.random() + '',
            author: typeof(author) == "string" ? this.users.get(author)! : author,
            participants: [],
            backgroundLink: ""
        }
        this.rallies.set(rally.id, rally)
        return rally
    }

    login(email: string, password: string) {
        const userData = this.userByEmails.get(email)

        if (!userData || userData.password !== password) return "password.invalid"
        this.currentLogin = userData

        return true
    }

    addUser(user: Data.User) {
        this.users.set(user.id, user)
        this.userByEmails.set(user.email, user)
        this.userByNames.set(user.name, user)
    }

    deleteUser(user: string | Data.User) {
        if (typeof(user) === "string") {
            const userObj = this.users.get(user)
            if (!userObj) return false
            user = userObj
        }

        this.users.delete(user.id)
        this.userByEmails.delete(user.email)
        this.userByNames.delete(user.name)

        return true
    }

    renameUser(user: Data.User, newName: string) {
        if (this.userByNames.has(user.name)) return "name.nonexistent"
        if (this.userByNames.has(newName)) return "name.exists"

        this.userByNames.delete(user.name)
        user.name = newName
        this.userByNames.set(user.name, user)

        return true
    }

    changeEmail(user: Data.User, newEmail: string) {
        if (this.userByEmails.has(user.email)) return "email.nonexistent"
        if (this.userByEmails.has(newEmail)) return "email.exists"

        this.userByEmails.delete(user.email)
        user.email = newEmail
        this.userByEmails.set(user.email, user)

        return true
    }

    save(where: Storage = localStorage, name = "data") {
        where.setItem(name, JSON.stringify(this.toJSON()))
    }

    load(where: Storage = localStorage, name = "data") {
        const data = where.getItem(name)
        if (!data) return
        this.loadJSON(JSON.parse(data))
    }

    loadJSON(_json: Data.RootJson) {
        const json = _json as any

        this.users = new Map<string, any>(json.users)
        this.rallies = new Map<string, any>(json.rallies)
        this.currentLogin = json.login && this.users.get(json.login)

        for (const {1: user} of json.users) {
            user.recentRallies = user.recentRallies.map((rallyId: string) => this.rallies.get(rallyId))
        }
        for (const {1: rally} of json.rallies) {
            rally.author = this.users.get(rally.author)
            rally.participants = rally.participants.map((participantId: string) => this.users.get(participantId))
        }
    }

    toJSON(): Data.RootJson {
        return {
            users: Array.from(this.users, ([id, user]) => [id, { ...user,
                recentRallies: user.recentRallies.map(v => v.id)
            }]),
            rallies: Array.from(this.rallies, ([id, rally]) => [id, { ...rally,
                author: rally.author.id,
                participants: rally.participants.map(v => v.id)
            }]),
            login: this.currentLogin?.id
        }
    }
}

declare global {
    namespace Data {
        interface RallyJson {
            id: string
            name: string
            description: string
            author: string
            startTime: number
            endTime: number
            backgroundLink: string
            tags: string[]
            participants: string[]
        }

        interface RallyOptions {
            name: string
            description: string
            startTime: number
            endTime: number
            tags: string[]
        }

        interface Rally extends Omit<RallyJson, 'participants' | 'author'> {
            author: User
            participants: User[]
        }

        interface UserJson {
            id: string
            name: string
            email: string
            /** Ideally store hashed, but for demo stored as plain */
            password: string
            aboutMe: string
            profileLink: string
            recentRallies: string[]
        }

        interface User extends Omit<UserJson, 'recentRallies'> {
            recentRallies: Rally[]
        }

        interface RootJson {
            users: [id: string, data: UserJson][]
            rallies: [id: string, data: RallyJson][]
            login?: string
        }
    }
}
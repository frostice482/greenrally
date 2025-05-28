import { VData } from "./data";

export default class RallySearchList {
    constructor(list?: Iterable<VData.Rally>) {
        this.list = new Set(list)
        this.updateAll()
    }

    rallyByTags = new Map<string, Set<VData.Rally>>()
    rallyKeywords = new Map<string, Map<VData.Rally, number>>()
    list: Set<VData.Rally>

    scoreTag = 40
    scoreMatch = 25
    scoreSparse = 10
    scoreOff = 3
    sparseMaxOffsetScore = 10

    addRally(rally: VData.Rally) {
        for (const tag of rally.tags) {
            let tagSet = this.rallyByTags.get(tag)
            if (!tagSet) this.rallyByTags.set(tag, tagSet = new Set)

            tagSet.add(rally)
        }
        for (const [i, word] of rally.title.toLowerCase().split(/\s+/).entries()) {
            let wordSet = this.rallyKeywords.get(word)
            if (!wordSet) this.rallyKeywords.set(word, wordSet = new Map)

            if (!wordSet.has(rally)) wordSet.set(rally, i)
        }
    }

    removeRally(rally: VData.Rally) {
        for (const tag of rally.tags) {
            this.rallyByTags.get(tag)?.delete(rally)
        }
        for (const word of rally.title.toLowerCase().split(/\s+/)) {
            this.rallyKeywords.get(word)?.delete(rally)
        }
    }

    updateAll() {
        this.rallyByTags.clear()
        this.rallyKeywords.clear()
        for (const rally of this.list) this.addRally(rally)
    }

    search(keywords: string, searchSparse = true, strictMatchWord = false) {
        const { rallyByTags, rallyKeywords, scoreTag, scoreMatch, scoreSparse, scoreOff } = this
        const matches = new Map<VData.Rally, number>()
        const sparses: string[] = []

        for (const [i, word] of keywords.toLowerCase().split(/\s+/).entries()) {
            const wordMatches = rallyKeywords.get(word)
            if (wordMatches) {
                for (const [rally, j] of wordMatches) {
                    matches.set(rally, (matches.get(rally) ?? 0) + scoreMatch - Math.abs(j - i) * scoreOff)
                }
            }

            const tagMatches = rallyByTags.get(word)
            if (tagMatches) {
                for (const rally of tagMatches) {
                    matches.set(rally, (matches.get(rally) ?? 0) + scoreTag)
                }
            }

            if (!wordMatches && !tagMatches && searchSparse) sparses.push(word)
        }

        if (!strictMatchWord)
            for (const sparse of sparses) {
                const match = this.searchSparse(sparse)
                console.log(sparse, '->', match)
                if (!match) continue

                const word = rallyKeywords.get(match)
                if (!word) continue

                for (const rally of word.keys()) {
                    matches.set(rally, (matches.get(rally) ?? 0) + scoreSparse)
                }
            }

        const arr = Array.from(matches).sort((a,b) => b[1] - a[1]).map(v => v[0])

        return arr
    }

    searchSparse(sparseWord: string, maxScore = this.sparseMaxOffsetScore) {
        let bestMatch
        for (const word of this.rallyKeywords.keys()) {
            if (sparseWord.length > word.length) continue
            const score = this.getSparseScore(word, sparseWord, maxScore)
            if (score < maxScore) {
                bestMatch = word
                maxScore = score
            }
        }
        return bestMatch
    }

    getSparseScore(word: string, sparse: string, max: number) {
        let score = 0
        let count = 0
        let j = 0
        for (let i = 0; i < word.length && score < max; i++) {
            if (sparse[j] === word[i]) {
                count = 0
                j++
            }
            else {
                score += ++count
            }
        }
        return score
    }
}
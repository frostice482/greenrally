import Header, { HeaderOpts } from "components/header";
import { jsx } from "jsx-dom/jsx-runtime";
import resizeListener from "lib/resizelis";
import { refreshingTimeout } from "lib/util";
import calendarUrl from "@/resources/calendar.svg?url"

export function SearchResultRally(opts: E.button & { rally: Data.Rally }) {
    const rally = opts.rally
    opts.children = <div class="flex-row align-center">
        <img src={calendarUrl} style={{height: "2em"}}/>
        <span>{rally.name}</span>
    </div>
    const elm = jsx("button", opts)
    elm.style.backgroundImage = `url(${rally.backgroundLink})`
    elm.classList.add("search-rally", "fill-x", "bg-cover")
    return elm
}

export default class SHeader<T extends SHeaderOpts = SHeaderOpts> extends Header<T> {
    constructor(sopts: T) {
        super(sopts)

        this.searchInput.addEventListener('input', () => this.searchTimeout(500))

        for (const rally of sopts.rallies) {
            // map tags
            for (const tag of rally.tags) {
                for (const tagChunk of tag.toLowerCase().split(/\s+/)) {
                    let set = this.searchTags.get(tagChunk)
                    if (!set) this.searchTags.set(tagChunk, set = new Set)
                    set.add(rally)
                }
            }

            // map keywords
            for (const [i, word] of rally.name.toLowerCase().split(/\s+/).entries()) {
                let map = this.searchKeywords.get(word)
                if (!map) this.searchKeywords.set(word, map = new Map)
                if (!map.has(rally)) map.set(rally, i)
            }
        }

        this.searchInput.addEventListener("focus", () => this.searchResult.hidden = false)
        this.searchInput.addEventListener("blur", () => this.searchResult.hidden = true)
        resizeListener.listen(this.searchInput, () => this.realignSearchResult())
    }

    searchTimeout = refreshingTimeout(() => this.handleSearch(this.searchInput.value))

    searchKeywords = new Map<string, Map<Data.Rally, number>>
    searchTags = new Map<string, Set<Data.Rally>>

    searchKeywordValue = 20
    searchSparseKeywordValue = 5
    searchTagValue = 40

    declare searchResult: HTMLElement

    protected beforeRender() {
        super.beforeRender()
        this.searchResult = this.makeSearchResult()
        this.resetSearch()
    }

    protected makeSearchResult() {
        return <div id="search-res" class="absolute flex-col" hidden/> as HTMLElement
    }

    protected makeSearch() {
        return <div id="search">
            {this.searchInput}
            {this.searchBtn}
            {this.searchResult}
        </div>
    }

    protected realignSearchResult() {
        const elms = this.searchResult.style
        const rect = this.search.getBoundingClientRect()
        elms.top = rect.bottom + 'px'
        elms.left = rect.left + 'px'
        elms.width = rect.width + 'px'
    }

    protected handleSearch(search: string) {
        if (search) this.showSearchResult(this.getSearchResult(search))
        else this.resetSearch()
    }

    resetSearch() {
        this.searchResult.replaceChildren("Start typing to search.")
    }

    showSearchResult(results: Data.Rally[]) {
        this.searchResult.replaceChildren(...results.slice(0, 10).map(v => <SearchResultRally rally={v} onClick={() => this.props.onRallyClick?.(v)}/>))
        if (!results.length) this.searchResult.append("No rally found. Try using a different keyword.")
    }

    getSearchResult(search: string, searchSparsely = true) {
        const matches = new Map<Data.Rally, number>()
        const words = search.toLowerCase().split(/\s+/)
        const sparses = new Set<string>()

        for (const [curPos, word] of words.entries()) {
            //exact match keyword
            const keywordList = this.searchKeywords.get(word)
            if (keywordList) {
                for (const [rally, pos] of keywordList) {
                    let crank = matches.get(rally) ?? 0
                    matches.set(rally, crank + this.searchKeywordValue - Math.abs(curPos - pos))
                }
            }
            //exact match tag
            const tagList = this.searchTags.get(word)
            if (tagList) {
                for (const rally of tagList) {
                    let crank = matches.get(rally) ?? 0
                    matches.set(rally, crank + this.searchTagValue)
                }
            }
            if (!keywordList && !tagList) sparses.add(word)
        }

        // sparse match keyword
        if (searchSparsely)
            for (const word of sparses) {
                const closest = this.predictWord(word)
                if (!closest) continue

                const keywordList = this.searchKeywords.get(closest)
                if (!keywordList) continue

                for (const [rally, pos] of keywordList) {
                    let crank = matches.get(rally) ?? 0
                    matches.set(rally, crank + this.searchSparseKeywordValue - pos)
                }
            }

        return Array.from(matches)
            .sort(({1: a}, {1: b}) => b - a)
            .map(entry => entry[0])
    }

    predictWord(sparseWord: string, threshold = 10) {
        let best = threshold, bestWord
        const slen = sparseWord.length

        for (const keyword of this.searchKeywords.keys()) {
            const klen = keyword.length
            if (klen < slen) continue
            let rank = 0
            let continuousDeduct = 0
            let i = 0, wi = 0

            for (;i < klen && rank < best; i++) {
                const kc = keyword[i]!, sc = sparseWord[wi]
                if (kc === sc) {
                    if (++wi >= slen) break
                    if (continuousDeduct > 0) continuousDeduct--
                }
                else {
                    rank += ++continuousDeduct
                }
            }

            if (wi === 0) continue

            rank += klen - wi - 1

            if (rank < best) {
                best = rank
                bestWord = keyword
            }
        }

        return bestWord
    }
}

export interface SHeaderOpts extends HeaderOpts {
    rallies: Data.Rally[]
    onRallyClick?: (data: Data.Rally) => void
}
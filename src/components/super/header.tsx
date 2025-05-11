import Header, { HeaderOpts } from "components/header";
import { refreshingTimeout } from "lib/util";

export default class SHeader extends Header {
    constructor(sopts: SHeaderOpts) {
        const { rallies } = sopts
        super(sopts)

        this.searchInput.addEventListener('change', () => this.searchTimeout(500))
    }

    searchTimeout = refreshingTimeout(() => this.showSearchResult(this.searchInput.value))

    showSearchResult(search: string) {

    }
}

export interface SHeaderOpts extends HeaderOpts {
    rallies: Data.Rally[]
}
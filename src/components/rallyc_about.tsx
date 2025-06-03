import { VData } from "data"
import BComp from "./lib/bcomp"

export default class Rally_About extends BComp {
    constructor(rally: VData.Rally) {
        super({})
        this.rally = rally
    }

    rally: VData.Rally

    protected makeNode() {
        const rally = this.rally
        return <div class="rally-about">
            <h2>About</h2>
            <p>
                {rally.description}
            </p>
        </div>
    }
}

import { textState } from "lib/state";
import BComp from "./bcomp";
import { Button, Discardable } from "./util";
import { VData } from "data";
import { roundInterval } from "lib/util";

export default class RallyEdit extends BComp<RallyEditOptions> {
    titleInput = <input class="fill-x" type="text" placeholder="Rally Title"/> as E.input
    dateStartInput = <input id="rally-start-input" type="datetime-local"/> as E.input
    dateEndInput = <input id="rally-end-input" type="datetime-local"/> as E.input
    tagsInput = <input
        placeholder="Add new tag (ENTER to add)"
        id="rally-tags-input"
        type="text"
        onKeyDown={ev => {
            if (ev.key !== ',' && ev.key !== 'Enter') return
            ev.preventDefault()
            this.addTag(ev.currentTarget.value)
            ev.currentTarget.value = ''
        }}
    /> as E.input
    eventTypeInput = <select class="border2" onChange={() => this.handleEventTypeChange()}>
        <option value="event">Event</option>
        <option value="activity">Activity</option>
    </select> as E.select
    descriptionInput = <textarea class="fill" style={{resize: 'none'}} placeholder="Write a description"/> as E.textarea

    tagsList = new Map<string, Element>()
    tagsListElm = <span style={{display: 'inline-flex', gap: '4px'}}/>

    startDateContainer = <tr>
        <td><label htmlFor="rally-start-input">Start date:</label></td>
        <td><div>
            {this.dateStartInput}
            <Button size="x" nostyle class="border" onClick={() => this.dateStartInput.valueAsNumber = roundInterval(Date.now(), 60000)}>today</Button>
        </div></td>
    </tr> as E

    endDateContainer = <tr>
        <td><label htmlFor="rally-end-input">End date:</label></td>
        <td><div>
            {this.dateEndInput}
            <Button size="x" nostyle class="border" onClick={() => this.dateEndInput.valueAsNumber = roundInterval(Date.now(), 60000)}>today</Button>
        </div></td>
    </tr> as E

    errmsg = textState()

    isEdit = false
    currentEditId?: string

    editFrom(rally: VData.Rally, rerender = true) {
        this.isEdit = true
        this.currentEditId = rally.id
        this.titleInput.value = rally.title
        this.descriptionInput.value = rally.description
        this.dateStartInput.valueAsNumber = roundInterval(rally.startTime || Date.now(), 60000)
        this.dateEndInput.valueAsNumber = roundInterval(rally.endTime || Date.now(), 60000)
        this.tagsInput.value = ''
        this.eventTypeInput.value = rally.isActivity ? 'activity' : 'event'
        this.tagsListElm.replaceChildren()
        this.tagsList.clear()
        for (const tag of rally.tags) this.addTag(tag)

        this.handleEventTypeChange()
        if (rerender) this.render(true)
    }

    addTag(tag: string) {
        if (!tag.trim() || this.tagsList.has(tag)) return
        const elm = this.createTag(tag)
        this.tagsList.set(tag, elm)
        this.tagsListElm.append(elm)
    }

    protected handleEventTypeChange() {
        const value = this.eventTypeInput.value
        this.startDateContainer.hidden = value !== 'event'
        this.endDateContainer.hidden = value !== 'event'
    }

    protected createTag(tag: string) {
        const elm = <Discardable buttionOpions={{onClick: () => {
            elm.remove()
            this.tagsList.delete(tag)
        }}}>{tag}</Discardable>
        elm.dataset.tag = tag
        return elm
    }

    protected trigger() {
        const data = this.data()
        if (data.error) return this.handleError(data)
        this.props.onPost?.(data)
    }

    protected handleError(err: RallyEditDataError) {
        const input = err.input
        const icolor = input.style.color
        const ab = new AbortController()
        ab.signal.addEventListener('abort', () => input.style.color = icolor)
        input.style.color = 'red'
        input.focus()
        input.addEventListener('blur', () => ab.abort(), { signal: ab.signal })
        input.addEventListener('input', () => ab.abort(), { signal: ab.signal })

        this.errmsg(`Error!${err.title ? ` (${err.title})` : ''} ${err.message}`)
    }

    protected data(): RallyEditDataError | RallyEditData {
        const { titleInput, descriptionInput, dateStartInput, dateEndInput, eventTypeInput } = this

        const title = titleInput.value.trim()
        if (!title) return {
            error: true,
            input: titleInput,
            message: 'Title cannot be empty'
        }

        const desc = descriptionInput.value.trim()
        if (!desc) return {
            error: true,
            input: descriptionInput,
            message: 'Description cannot be empty'
        }
        const start = dateStartInput.valueAsDate
        const end = dateEndInput.valueAsDate

        const rallyType = eventTypeInput.value
        switch (rallyType) {
            case 'event': {
                if (!start) return {
                    error: true,
                    input: dateStartInput,
                    message: 'Start date is required for an event'
                }
                if (!end) return {
                    error: true,
                    input: dateEndInput,
                    message: 'End date is required for an event'
                }
                if (start.getTime() > end.getTime()) return {
                    error: true,
                    input: dateEndInput,
                    message: 'End date must be later than start date'
                }
                if (start.getTime() < Date.now()) return {
                    error: true,
                    input: dateStartInput,
                    message: 'Created event must be upcoming, not ongoing'
                }
                if (end.getTime() < Date.now()) return {
                    error: true,
                    input: dateEndInput,
                    message: 'Created event must be upcoming, not outdated'
                }
            } break;

            case 'activity': {} break

            default:
                return {
                    error: true,
                    input: eventTypeInput,
                    message: 'Unknown rally type ' + rallyType
                }
        }

        return {
            error: false,
            title: title,
            description: desc,
            rallyType: rallyType,
            startDate: start ?? new Date(0),
            endDate: end ?? new Date(0),
            tags: Array.from(this.tagsList.keys()),
            currentEditId: this.currentEditId
        }
    }

    protected makeOptionsInput() {
        return <table>
            <colgroup>
                <col style={{width: '100px'}}></col>
            </colgroup>
            <tbody>
                <tr>
                    <td>Rally type:</td>
                    <td>{this.eventTypeInput}</td>
                </tr>
                {this.startDateContainer}
                {this.endDateContainer}
                <tr>
                    <td><label htmlFor="rally-tags-input">Tags:</label></td>
                    <td>{this.tagsListElm} {this.tagsInput}</td>
                </tr>
            </tbody>
        </table>
    }

    protected makeTitle() {
        return <div class="flex-aa">
            <h2>{this.isEdit ? 'Edit Rally' : 'Create Rally'}</h2>
            {this.isEdit && <small>Editing <b>{this.titleInput.value}</b></small>}

            <div class="flex-fill"/>

            <span style={{color: 'red'}}>{this.errmsg()}</span>
            <Button size="s" onClick={() => this.trigger()}>{this.isEdit ? 'Update' : 'Create'}</Button>
        </div>
    }

    protected makeNode() {
        this.errmsg('')

        return <form class="rally-edit container fill flex-col" onSubmit={ev => ev.preventDefault()}>
            {this.makeTitle()}
            <hr class="fill-x"/>

            <h1>{this.titleInput}</h1>
            {this.makeOptionsInput()}

            <hr class="fill-x"/>
            {this.descriptionInput}
        </form>
    }

    hasData() {
        return Boolean(this.titleInput.value
            || this.descriptionInput.value
            || this.dateStartInput.value
            || this.dateEndInput.value
            || this.tagsList.size)
    }
}

export interface RallyEditDataError {
    error: true
    input: HTMLElement
    title?: string
    message: string
}

export interface RallyEditData {
    error: false
    title: string
    rallyType: 'event' | 'activity'
    startDate: Date
    endDate: Date
    tags: string[]
    description: string
    currentEditId?: string
}

export interface RallyEditOptions {
    onPost?: (data: RallyEditData) => void
}
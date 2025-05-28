namespace Format {
	export const dateTime = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short', hourCycle: 'h23' })
	export const time = new Intl.DateTimeFormat(undefined, { timeStyle: 'short', hourCycle: 'h23' })
	export const week = new Intl.DateTimeFormat(undefined, { weekday: 'short' })
	export const monthLong = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'long' })

	export function month(date: string | number | Date) {
		if (!(date instanceof Date)) date = new Date(date)
		return date.getFullYear() + '-' + (date.getMonth()+1).toString().padStart(2, '0')
	}

	let weekutc = new Intl.DateTimeFormat(undefined, { weekday: 'short', timeZone: 'UTC' })
	export const weekNames = Array.from({length: 7}, (_, i) => weekutc.format(86400000*(i+3)))
}
export default Format

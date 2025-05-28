namespace Encoding {
	const hexChar = '0123456789abcdef'
	const hexHigh: Record<string, number> = Object.create(null)
	const hexLow: Record<string, number> = Object.create(null)
	const hexRev: Record<number, string> = Object.create(null)

	export const textenc = new TextEncoder()
	export const textdec = new TextDecoder()

	for (let i = 0; i < 16; i++) {
		const cHigh = hexChar[i]!
		hexHigh[cHigh] = i*16
		hexLow[cHigh] = i
		for (let j = 0; j < 16; j++) hexRev[i*16+j] = cHigh + hexChar[j]!
	}

	export function toHex(buf: Iterable<number> | ArrayBuffer) {
		const nbuf = buf instanceof ArrayBuffer ?  new Uint8Array(buf) : buf
		return Array.from(nbuf, v => hexRev[v]).join('')
	}

	export function fromHex(hex: string) {
		const buf = new Uint8Array(Math.ceil(hex.length/2))
		for (let i = 0, j = 0; i < hex.length; i++) buf[i] = hexHigh[hex[j++]!]! + hexLow[hex[j++]!]!
		return buf
	}

	export function toBase64(buf: Iterable<number> | ArrayBuffer) {
		const nbuf = buf instanceof ArrayBuffer ?  new Uint8Array(buf) : buf
		return btoa(String.fromCharCode(...nbuf))
	}

	export function fromBase64(b64str: string) {
		return fromAscii(atob(b64str))
	}

	export function fromAscii(str: string) {
		const buf = new Uint8Array(str.length)
		for (let i = 0; i < str.length; i++) buf[i] = str.charCodeAt(i)
		return buf
	}
}

export default Encoding

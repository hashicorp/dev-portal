/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect, useState, useRef } from 'react'

/**
 * use a ref to check if an element's Y-scrollbar is visible
 *
 * Note: this hook is intentionally opinionated, but is not far from being more generic
 * - it is only concerned with Y axis
 * - it assumes top-to-bottom scrolling
 */
export function useScrollBarVisible() {
	const elementRef = useRef(null)
	const [isScrollbarYVisible, setIsScrollbarYVisible] = useState(false)
	const [reachedYEnd, setReachedYEnd] = useState(false)

	useEffect(() => {
		const element = elementRef.current
		if (!element) {
			return
		}

		function checkScrollbarVisibility() {
			// is the element scrollable?
			const hasScrollbarY = element.scrollHeight > element.clientHeight
			setIsScrollbarYVisible(hasScrollbarY)

			// has scrolling reached the end?

			const atEnd =
				/* total elem height - current scroll position */
				element.scrollHeight - element.scrollTop <=
				/* visible elem height + 5px buffer */
				element.clientHeight + 5

			setReachedYEnd(atEnd)
		}

		element.addEventListener('scroll', checkScrollbarVisibility)
		window.addEventListener('resize', checkScrollbarVisibility)

		checkScrollbarVisibility()

		return () => {
			window.removeEventListener('resize', checkScrollbarVisibility)
			element.removeEventListener('scroll', checkScrollbarVisibility)
		}
	}, [elementRef.current])

	return [elementRef, isScrollbarYVisible && !reachedYEnd] as const
}

// support passing multiple refs to an element
// https://github.com/gregberge/react-merge-refs/blob/main/src/index.tsx
export function mergeRefs<T = any>(
	refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>
): React.RefCallback<T> {
	return (value) => {
		refs.forEach((ref) => {
			if (typeof ref === 'function') {
				ref(value)
			} else if (ref != null) {
				;(ref as React.MutableRefObject<T | null>).current = value
			}
		})
	}
}

// throttle a value
export function useThrottle<T = any>(value: T, limit: number) {
	const [throttledValue, setThrottledValue] = useState(value)
	const lastRan = useRef(Date.now())

	useEffect(() => {
		const handler = setTimeout(function () {
			if (Date.now() - lastRan.current >= limit) {
				setThrottledValue(value)
				lastRan.current = Date.now()
			}
		}, limit - (Date.now() - lastRan.current))

		return () => {
			clearTimeout(handler)
		}
	}, [value, limit])

	return throttledValue
}

type Bytes = string | ArrayBuffer | Uint8Array | Buffer | null | undefined
type ServerSentEvent = {
	event: string | null
	data: string
	raw: string[]
}

/**
 * This is copied as is from https://github.com/openai/openai-node/blob/d1fee339243134384fb24a9255fa65a04b6d5257/src/streaming.ts#L72
 */
class SSEDecoder {
	private data: string[]
	private event: string | null
	private chunks: string[]

	constructor() {
		this.event = null
		this.data = []
		this.chunks = []
	}

	decode(line: string) {
		if (line.endsWith('\r')) {
			line = line.substring(0, line.length - 1)
		}

		if (!line) {
			// empty line and we didn't previously encounter any messages
			if (!this.event && !this.data.length) {
				return null
			}

			const sse: ServerSentEvent = {
				event: this.event,
				data: this.data.join('\n'),
				raw: this.chunks,
			}

			this.event = null
			this.data = []
			this.chunks = []

			return sse
		}

		this.chunks.push(line)

		if (line.startsWith(':')) {
			return null
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const
		let [fieldname, _, value] = partition(line, ':')

		if (value.startsWith(' ')) {
			value = value.substring(1)
		}

		if (fieldname === 'event') {
			this.event = value
		} else if (fieldname === 'data') {
			this.data.push(value)
		}

		return null
	}
}

/**
 * This is copied as is from https://github.com/openai/openai-node/blob/d1fee339243134384fb24a9255fa65a04b6d5257/src/streaming.ts#L133
 */
class LineDecoder {
	// prettier-ignore
	static NEWLINE_CHARS = new Set(['\n', '\r', '\x0b', '\x0c', '\x1c', '\x1d', '\x1e', '\x85', '\u2028', '\u2029']);
	// eslint-disable-next-line no-control-regex
	static NEWLINE_REGEXP = /\r\n|[\n\r\x0b\x0c\x1c\x1d\x1e\x85\u2028\u2029]/g

	buffer: string[]
	trailingCR: boolean
	textDecoder: any // TextDecoder found in browsers; not typed to avoid pulling in either "dom" or "node" types.

	constructor() {
		this.buffer = []
		this.trailingCR = false
	}

	decode(chunk: Bytes): string[] {
		let text = this.decodeText(chunk)

		if (this.trailingCR) {
			text = '\r' + text
			this.trailingCR = false
		}
		if (text.endsWith('\r')) {
			this.trailingCR = true
			text = text.slice(0, -1)
		}

		if (!text) {
			return []
		}

		const trailingNewline = LineDecoder.NEWLINE_CHARS.has(
			text[text.length - 1] || ''
		)
		let lines = text.split(LineDecoder.NEWLINE_REGEXP)

		if (lines.length === 1 && !trailingNewline) {
			this.buffer.push(lines[0]!)
			return []
		}

		if (this.buffer.length > 0) {
			lines = [this.buffer.join('') + lines[0], ...lines.slice(1)]
			this.buffer = []
		}

		if (!trailingNewline) {
			this.buffer = [lines.pop() || '']
		}

		return lines
	}

	decodeText(bytes: Bytes): string {
		if (bytes == null) {
			return ''
		}
		if (typeof bytes === 'string') {
			return bytes
		}

		// Node:
		if (typeof Buffer !== 'undefined') {
			if (bytes instanceof Buffer) {
				return bytes.toString()
			}
			if (bytes instanceof Uint8Array) {
				return Buffer.from(bytes).toString()
			}

			throw new Error(
				`Unexpected: received non-Uint8Array (${bytes.constructor.name}) stream chunk in an environment with a global "Buffer" defined, which this library assumes to be Node. Please report this error.`
			)
		}

		// Browser
		if (typeof TextDecoder !== 'undefined') {
			if (bytes instanceof Uint8Array || bytes instanceof ArrayBuffer) {
				this.textDecoder ??= new TextDecoder('utf8')
				return this.textDecoder.decode(bytes)
			}

			throw new Error(
				`Unexpected: received non-Uint8Array/ArrayBuffer (${
					(bytes as any).constructor.name
				}) in a web platform. Please report this error.`
			)
		}

		throw new Error(
			`Unexpected: neither Buffer nor TextDecoder are available as globals. Please report this error.`
		)
	}

	flush(): string[] {
		if (!this.buffer.length && !this.trailingCR) {
			return []
		}

		const lines = [this.buffer.join('')]
		this.buffer = []
		this.trailingCR = false
		return lines
	}
}

function partition(str: string, delimiter: string): [string, string, string] {
	const index = str.indexOf(delimiter)
	if (index !== -1) {
		return [
			str.substring(0, index),
			delimiter,
			str.substring(index + delimiter.length),
		]
	}

	return [str, '', '']
}

/**
 * This function accepts an externally instantiated ReadableStreamDefaultReader
 *
 * @example
 * ```js
 * const res = await fetch()
 * const reader = res.body.getReader()
 *
 * const iter = streamToAsyncIterable(reader)
 *
 * // This allows the consumer to be able to call
 * reader.cancel() // cancel the stream as needed
 *
 * // Iterate over the stream
 * for await (const data of iter) {
 *   // ...
 * }
 * ```
 */
export async function* streamToAsyncIterable(
	reader: ReadableStreamDefaultReader<Uint8Array>
) {
	const textDecoder = new TextDecoder()
	const sseDecoder = new SSEDecoder()
	const lineDecoder = new LineDecoder()

	let isDone = false
	while (!isDone) {
		try {
			const { done, value } = await reader.read()

			if (done) {
				reader.releaseLock()
				isDone = true
				break
			}

			// Uint8Array to string
			const chunk = textDecoder.decode(value)
			//
			for (const line of lineDecoder.decode(chunk)) {
				const sse = sseDecoder.decode(line)
				if (sse) {
					yield sse
				}
			}
		} catch (e) {
			reader.releaseLock() // release lock when stream becomes errored
			throw e
		}
	}
}

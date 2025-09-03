import type { MouseEvent } from 'react'

const getTextToCopy = (text: string | number | bigint) => {
	let textToCopy: string

	if (text) {
		if (typeof text === 'string') {
			textToCopy = text
		} else if (
			// context: https://github.com/hashicorp/design-system/pull/1564
			typeof text === 'number' ||
			typeof text === 'bigint'
		) {
			textToCopy = text.toString()
		} else {
			throw new Error(
				`\`hds-clipboard\` modifier - \`text\` argument must be a string - provided: ${typeof text}`
			)
		}
	}
	return textToCopy!
}

const getTargetElement = (target: string | Element) => {
	let targetElement: Element | null
	if (typeof target === 'string') {
		targetElement = document.querySelector(target)

		if (!targetElement) {
			console.error(
				'`hds-clipboard` modifier - `target` selector provided does not point to an existing DOM node, check your selector string',
				targetElement
			)
			return
		}
	} else if (target instanceof Node && target.nodeType === Node.ELEMENT_NODE) {
		targetElement = target
	} else {
		if (target instanceof NodeList) {
			throw new Error(
				'`hds-clipboard` modifier - `target` argument must be a string or a DOM node - provided: a list of DOM nodes'
			)
		} else {
			throw new Error(
				`\`hds-clipboard\` modifier - \`target\` argument must be a string or a DOM node - provided: ${typeof target}`
			)
		}
	}
	return targetElement
}

const getTextToCopyFromTargetElement = (targetElement: Element | undefined) => {
	let textToCopy: string | undefined
	if (
		targetElement instanceof Node &&
		targetElement.nodeType === Node.ELEMENT_NODE
	) {
		if (
			targetElement instanceof HTMLInputElement || // targetElement.nodeName === 'INPUT' ||
			targetElement instanceof HTMLTextAreaElement || // targetElement.nodeName === 'TEXTAREA' ||
			targetElement instanceof HTMLSelectElement // targetElement.nodeName === 'SELECT'
		) {
			textToCopy = targetElement.value
		} else {
			// simplest approach
			textToCopy = (targetElement as HTMLElement).innerText

			// approach based on text selection (left for backup just in case)
			// var selection = window.getSelection();
			// var range = document.createRange();
			// selection.removeAllRanges();
			// range.selectNodeContents(targetElement);
			// selection.addRange(range);
			// textToCopy = selection.toString();
			// selection.removeAllRanges();
		}
	}
	return textToCopy
}

const writeTextToClipboard = async (textToCopy: string | undefined) => {
	// finally copy the text to the clipboard using the Clipboard API
	// https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
	if (textToCopy) {
		try {
			// notice: the "clipboard-write" permission is granted automatically to pages when they are in the active tab
			// https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/write
			await navigator.clipboard.writeText(textToCopy)
			// DEBUG uncomment this for easy debugging
			// console.log('success', textToCopy);
			return true
		} catch (error) {
			// clipboard write failed
			// this probably never happens (see comment above) or happens only for very old browsers that don't for which `navigator.clipboard` is undefined
			console.warn(
				'copy action failed, please check your browser‘s permissions',
				{
					id: 'hds-clipboard.write-text-to-clipboard.catch-error',
				}
			)
			return false
		}
	} else {
		return false
	}
}

const copyToClipboard = async (
	text: string | number | bigint | undefined,
	target: string | Element | undefined,
	getTextFn: (() => string) | undefined
) => {
	let textToCopy: string | undefined

	if (getTextFn) {
		textToCopy = getTextFn()
	} else if (text) {
		textToCopy = getTextToCopy(text)
	} else if (target) {
		const targetElement = getTargetElement(target)
		textToCopy = getTextToCopyFromTargetElement(targetElement)
	} else {
		throw new Error(
			'`hds-clipboard` modifier - either a `getTextFn`, `text`, or a `target` argument is required'
		)
	}
	const success = await writeTextToClipboard(textToCopy)
	return success
}

type HandlerArgs = {
	trigger: Element
	text: string | number | bigint | undefined
	target: string | Element | undefined
}

const onClickHandler = (named: {
	text: string | number | bigint | undefined
	target: string | Element | undefined
	getTextFn: (() => string) | undefined
	onSuccess: (args: HandlerArgs) => void
	onError: (args: HandlerArgs) => void
}) => {
	const { text, target, getTextFn, onSuccess, onError } = named

	const onClick = async (event: MouseEvent<HTMLButtonElement>) => {
		const trigger = event.currentTarget
		const success = await copyToClipboard(text, target, getTextFn)

		// fire the `onSuccess/onError` callbacks (if provided)
		if (success) {
			if (typeof onSuccess === 'function') {
				onSuccess({ trigger, text, target })
			}
		} else {
			if (typeof onError === 'function') {
				onError({ trigger, text, target })
			}
		}
	}

	return { onClick }
}

export { onClickHandler, type HandlerArgs }

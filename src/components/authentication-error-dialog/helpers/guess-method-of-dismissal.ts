/**
 * Guess the method of dismissal for analytics tracking. This informs us
 * of how users are interacting with the dialog.
 *
 * Depending on how long the modal is in use (a longer term solution is in
 * progress), we can gather insights about how users interact with this
 * component over time.
 *
 * Examples questions that can be answered with this data:
 *  - How many users choose to sign in again?
 *  - How many users stop signing in again over time?
 *  - How many users take no action on the modal and do something else?
 *    - Refresh the page
 *    - Close the tab/window
 */
const guessMethodOfDismissal = ({ dismissEvent, closeButtonRef }) => {
	let methodOfDismissal = 'unknown'
	const eventType = dismissEvent.type
	if (eventType === 'click') {
		const isCloseButtonClick = closeButtonRef?.current?.contains(
			dismissEvent.target
		)
		methodOfDismissal = isCloseButtonClick ? 'close button' : 'overlay click'
	} else if (eventType === 'keydown') {
		methodOfDismissal = 'ESCAPE key'
	}

	return methodOfDismissal
}

export { guessMethodOfDismissal }

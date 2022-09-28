/**
 * Given the current documentHeight and windowHeight,
 * Return the percentage of the page content that has been viewed.
 *
 * Provides the option to `excludeWindowHeight`.
 * - When `false` or omitted, window height is included in scroll percentage.
 * - When `true`, window height is not included in scroll percentage.
 *
 * As an example, consider `documentHeight = 1000px` and `windowHeight = 500px`.
 * We have `500px` that the user can scroll through.
 *
 * With `excludeWindowHeight = false`, we include window height:
 * - On initial load, before any `scroll` events, we'll return `50%`.
 *   50% represents that 500px of the 1000px document has been seen.
 * - After 250px of scrolling, we'll return `75%`.
 *   75% represents that 750px of the 1000px document has been seen.
 *
 * With `excludeWindowHeight = true`, we only count scrolled pixels:
 * - On initial load, before any `scroll` events, we'll return `0%`.
 *   0% represents that we've scrolled 0px of the 500px scrollable distance.
 * - After 250px of scrolling, we'll return `50%`.
 *   50% represents that we've scrolled 250px of the 500px scrollable distance.
 */
export function getPercentageScrolled(
	documentHeight: number,
	windowHeight: number,
	excludeWindowHeight?: boolean
): number {
	let portionScrolled
	if (excludeWindowHeight) {
		const scrollableDistance = documentHeight - windowHeight
		portionScrolled = window.scrollY / scrollableDistance
	} else {
		const scrollOffset = window.scrollY + windowHeight
		portionScrolled = scrollOffset / documentHeight
	}
	return portionScrolled * 100
}

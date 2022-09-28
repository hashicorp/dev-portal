/**
 * Given the current documentHeight and windowHeight,
 * Return the percentage of the page content that has been viewed.
 */
export function getPercentageScrolled(
	documentHeight: number,
	windowHeight: number
): number {
	const scrollOffset = window.scrollY + windowHeight
	console.log({ scrollOffset, windowHeight, documentHeight })
	return (scrollOffset / documentHeight) * 100
}

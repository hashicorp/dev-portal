import { isBrowser } from 'lib/is-browser'
import getCSSVariableFromDocument from 'lib/get-css-variable-from-document'

const NAVIGATION_HEADER_HEIGHT_FALLBACK = 68

/**
 * The sticky header has a specific height and we care about headings that are
 * visible below it. This function calculates the height of the header based on
 * a CSS variable.
 *
 * TODO: this may need to be refactored when we address the brittleness of our
 * header height.
 */
export default function getFullNavHeaderHeight(): number {
	if (!isBrowser) {
		return NAVIGATION_HEADER_HEIGHT_FALLBACK
	} else {
		return getCSSVariableFromDocument('--navigation-header-height', {
			asNumber: true,
			fallback: NAVIGATION_HEADER_HEIGHT_FALLBACK,
		}) as number
	}
}

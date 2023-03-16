import { Children, ReactChild, ReactElement } from 'react'
import { isPageHeadingChild } from './is-page-heading-child'
import { getElementTextContent } from './get-element-text-content'
import { isElement } from 'react-is'

/**
 * Typeguard that uses `react-is` to ensure a value is a `ReactElement`.
 */
function isReactElement(value): value is ReactElement {
	return isElement(value)
}

/**
 * Iterate over the content children,
 * extracting <h1> text to use as the `heading` for our `LandingHero`,
 * and avoiding duplicative rendering of the <h1>.
 */
export default function extractPageHeading(
	children: ReactChild[]
): { title: string; id: string } | null {
	const headingChild = Children.toArray(children).find(isPageHeadingChild)
	// If we didn't find a matching ReactElement, return `null`
	if (!headingChild || !isReactElement(headingChild)) {
		return null
	}
	// If we did find a match, extract the `title` and `id`, and return them
	return {
		title: getElementTextContent(headingChild),
		id: headingChild.props.id,
	}
}

import { ReactChild } from 'react'

/**
 * Given a `ReactChild`, from MDX content,
 * Return `true` if the element is an `h1` element, or `false` otherwise.
 */
export function isPageHeadingChild(child: ReactChild): boolean {
	// Skip over string and number literals (we can't access props on these)
	if (typeof child === 'string' || typeof child === 'number') {
		return false
	}

	// Otherwise, we can check props to determine if this is the page heading
	return child.props.originalType === 'h1'
}

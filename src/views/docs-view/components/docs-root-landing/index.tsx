import { Children, ReactChild } from 'react'
import LandingHero from 'components/landing-hero'

function getElementTextContent(child) {
	let textContent = ''

	Children.forEach(child.props.children, (child) => {
		if (typeof child === 'string') {
			textContent += child
		}
	})

	return textContent
}

/**
 * TEMPORARY
 *
 * A structured page view that wraps rendered MDX content, extracts the first rendered H1 and p tags and renders a
 * landing hero in their place. Used to demonstrate structured page views pattern driven by frontmatter
 */
export default function DocsRootLanding({
	children,
}: {
	children: ReactChild[]
}) {
	let heading
	let subtitle

	const childrenToRender = Children.map(children, (child) => {
		if (typeof child === 'string' || typeof child === 'number') {
			return child
		}

		if (!heading && child.props.originalType === 'h1') {
			heading = {
				title: getElementTextContent(child),
				id: child.props.id,
			}
			return null
		}
		if (!subtitle && child.props.originalType === 'p') {
			subtitle = child
			return null
		}
		return child
	})

	return (
		<>
			<LandingHero pageHeading={heading} pageSubtitle={subtitle} />
			{childrenToRender}
		</>
	)
}

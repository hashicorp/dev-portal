import { Children, ReactChild } from 'react'
import LandingHero from 'components/landing-hero'
import { getElementTextContent } from './utils/get-element-text-content'
import s from '../../docs-view.module.css'

/**
 * A structured page view that wraps rendered MDX content,
 * extracts the first rendered <h1>, and renders a landing hero in its place.
 *
 * Used to meet our current design specs for docs landing pages, and to
 * demonstrate structured page views pattern driven by frontmatter.
 */
export default function DocsRootLanding({
	children,
	subtitle,
}: {
	children: ReactChild[]
	subtitle: string
}) {
	/**
	 * Iterate over the content children,
	 * extracting <h1> text to use as the `heading` for our `LandingHero`,
	 * and avoiding duplicative rendering of the <h1>.
	 */
	let heading
	const childrenToRender = Children.map(children, (child: ReactChild) => {
		// Skip over string and number literals (we can't access props on these)
		if (typeof child === 'string' || typeof child === 'number') {
			return child
		}

		// Access props to find the <h1> element on the page
		if (child.props.originalType === 'h1') {
			heading = {
				title: getElementTextContent(child),
				id: child.props.id,
			}
			return null
		}

		// Return non-<h1> elements unmodified
		return child
	})

	/**
	 * MDX content should contain an <h1/>, but this is not guaranteed.
	 * Our <LandingHero /> requires a heading, so we avoid rendering it
	 * if we have not found an <h1> in the MDX content.
	 */
	const hasHeading = !!heading

	return (
		<>
			{hasHeading ? (
				<LandingHero pageHeading={heading} pageSubtitle={subtitle} />
			) : null}
			<div className={s.mdxContent}>{childrenToRender}</div>
		</>
	)
}

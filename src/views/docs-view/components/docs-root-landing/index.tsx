import { Children, useMemo } from 'react'
import LandingHero from '../hero'

function getElementTextContent(child) {
	let textContent = ''

	Children.forEach(child.props.children, (child) => {
		if (typeof child === 'string') {
			textContent += child
		}
	})

	return textContent
}

export default function DocsRootLanding({ children, heading, subtitle }) {
	let firstH1
	let firstP
	const childrenToRender = Children.map(children, (child) => {
		if (!firstH1 && child.props.originalType === 'h1') {
			firstH1 = {
				title: getElementTextContent(child),
				id: child.props.id,
			}
			return null
		}
		if (!firstP && child.props.originalType === 'p') {
			firstP = child
			return null
		}
		return child
	})

	return (
		<>
			<LandingHero pageHeading={firstH1} pageSubtitle={firstP} />
			{childrenToRender}
		</>
	)
}

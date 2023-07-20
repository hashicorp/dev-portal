/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import DirectionalLinkBox from './components/directional-link-box'
import s from './next-previous.module.css'

export interface NextPreviousProps {
	tutorial: {
		next?: LinkProps
		previous?: LinkProps
		isLast: boolean
	}
	collection: {
		current: LinkProps
		next?: LinkProps
		isLast: boolean
	}
	finalLink: string
}

type LinkProps = {
	name: string
	path: string
}

export function NextPrevious({
	tutorial,
	collection,
	finalLink,
}: NextPreviousProps) {
	function renderPreviousLink() {
		// by default, render the link to the previous tutorial in the collection
		if (tutorial.previous) {
			return (
				<DirectionalLinkBox
					label="Previous"
					name={tutorial.previous.name}
					href={tutorial.previous.path}
					direction={'previous'}
					ariaLabel={`Go to previous tutorial: ${tutorial.previous.name}`}
				/>
			)
		}

		/**
		 *  if the previous tutorial is undefined (its the first
		 * tutorial in a collection) render a 'back to collection' link
		 */
		return (
			<DirectionalLinkBox
				href={collection.current.path}
				label="Collection Overview"
				name={collection.current.name}
				direction={'previous'}
				ariaLabel={`Go back to collection overview: ${collection.current.name}`}
			/>
		)
	}

	function renderNextLink() {
		// by default, link to the next tutorial in the collection
		if (tutorial.next && !tutorial.isLast) {
			return (
				<DirectionalLinkBox
					label="Next"
					name={tutorial.next.name}
					href={tutorial.next.path}
					direction="next"
					ariaLabel={`Go to next tutorial: ${tutorial.next.name}`}
				/>
			)
		}

		/**
		 * @TODO - interim state for 'final' link
		 * This link shows on the last tutorial in the last collection in sidebar order
		 * In learn, it links to a filtered advanced search page state
		 * e.g. https://learn.hashicorp.com/search?product=waypoint&page=1
		 *
		 * Since don't have an advanced search page for beta,
		 * were linking folks back to the base
		 * product tutorials page.
		 *
		 */

		if (collection.isLast) {
			return (
				<DirectionalLinkBox
					href={finalLink}
					label="Next"
					name="Explore tutorial library"
					direction="final"
					ariaLabel="Browse Tutorials"
				/>
			)
		}

		/**
		 *  if the tutorial is the last in the collection,
		 *  link to the next collection in the product collection sidebar order
		 */
		return (
			<DirectionalLinkBox
				href={collection.next.path}
				label="Next Collection"
				name={collection.next.name}
				direction="next"
				ariaLabel={`Go to next collection: ${collection.next.name}`}
			/>
		)
	}
	return (
		<div className={s.linkBoxWrapper}>
			{renderPreviousLink()}
			{renderNextLink()}
		</div>
	)
}

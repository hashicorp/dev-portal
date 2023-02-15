/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { parseAlgoliaHitHighlight } from '@algolia/autocomplete-preset-algolia'

type HighlightHitProps<THit> = {
	/**
	 * The Algolia hit whose attribute to retrieve the highlighted parts from.
	 */
	hit: THit
	/**
	 * The attribute to retrieve the highlighted parts from.
	 *
	 * You can use the array syntax to reference nested attributes.
	 */
	attribute: keyof THit | string[]
	/**
	 * The tag name to use for highlighted parts.
	 *
	 * @default "mark"
	 */
	tagName?: string
}

export function Highlight<THit>({
	hit,
	attribute,
	tagName = 'mark',
}: HighlightHitProps<THit>): JSX.Element {
	const Element = tagName as keyof JSX.IntrinsicElements

	return (
		<>
			{parseAlgoliaHitHighlight<THit>({ hit, attribute }).map(
				({ value, isHighlighted }, index) => {
					if (isHighlighted) {
						return <Element key={index}>{value}</Element>
					}

					return value
				}
			)}
		</>
	)
}

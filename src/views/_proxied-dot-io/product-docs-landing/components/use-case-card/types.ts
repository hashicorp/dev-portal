/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

export interface UseCaseCardProps {
	/** Title text to show at the top of the card. */
	heading: string
	/** Descriptive text to show below the card heading.  */
	body: string
	/** Links to display in the card, below the body text */
	links: {
		title: string
		url: string
	}[]
}

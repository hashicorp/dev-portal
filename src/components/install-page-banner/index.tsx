/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import InlineAlert from 'components/inline-alert'
import InlineLink from 'components/inline-link'
import type { InstallPageBannerProps, InstallPageBannerLink } from './types'

/**
 * Splits `description` around the first occurrence of `link.text` and returns
 * a React fragment with an `InlineLink` spliced in at that position.
 *
 * If `link.text` is not found verbatim in `description`, the link is appended
 * after the description text as a fallback rather than silently omitting it.
 */
function renderDescription(
	description: string,
	link?: InstallPageBannerLink,
): ReactNode {
	if (!link) {
		return description
	}

	const inlineLink = (
		<InlineLink href={link.href} textSize={200}>
			{link.text}
		</InlineLink>
	)
	const index = description.indexOf(link.text)

	if (index === -1) {
		// Graceful fallback: link text not found in description string
		return (
			<>
				{description} {inlineLink}
			</>
		)
	}

	const before = description.slice(0, index)
	const after = description.slice(index + link.text.length)

	return (
		<>
			{before}
			{inlineLink}
			{after}
		</>
	)
}

/**
 * A configurable notice banner for install pages.
 *
 * By default the banner uses `--product-color` for its border and icon, so it
 * automatically matches the brand color of whatever product page it appears on
 * without any per-product configuration.
 *
 * Pass `color="warning"` or `color="critical"` only when the notice needs to
 * convey urgency independent of the product brand.
 *
 * Configured via `installBanners.community` or `installBanners.enterprise`
 * in each product's `src/content/{product}/install-landing.json`.
 */
export function InstallPageBanner({
	description,
	link,
}: InstallPageBannerProps) {
	return (
		<InlineAlert 
			title={""}
			description={renderDescription(description, link)}
		/>
	)
}

export type { InstallPageBannerProps, InstallPageBannerLink }

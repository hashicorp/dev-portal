/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import classNames from 'classnames'
import { IconInfo16 } from '@hashicorp/flight-icons/svg-react/info-16'
import InlineLink from 'components/inline-link'
import type { InstallPageBannerProps, InstallPageBannerLink } from './types'
import s from './install-page-banner.module.css'

/**
 * Splits `description` around the first occurrence of `link.text` and returns
 * a React fragment with an `InlineLink` spliced in at that position.
 *
 * If `link.text` is not found verbatim in `description`, the link is appended
 * after the description text as a fallback rather than silently omitting it.
 */
function renderDescription(
	description: string,
	link?: InstallPageBannerLink
): ReactNode {
	if (!link) {
		return description
	}

	const index = description.indexOf(link.text)

	if (index === -1) {
		// Graceful fallback: link text not found in description string
		return (
			<>
				{description}{' '}
				<InlineLink href={link.href} textSize={200}>
					{link.text}
				</InlineLink>
			</>
		)
	}

	const before = description.slice(0, index)
	const after = description.slice(index + link.text.length)

	return (
		<>
			{before}
			<InlineLink href={link.href} textSize={200}>
				{link.text}
			</InlineLink>
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
export default function InstallPageBanner({
	color,
	description,
	link,
}: InstallPageBannerProps) {
	return (
		<div className={classNames(s.root, color && s[color])}>
			<span className={s.icon} aria-hidden="true">
				<IconInfo16 />
			</span>
			<p className={s.description}>{renderDescription(description, link)}</p>
		</div>
	)
}

export type { InstallPageBannerProps, InstallPageBannerLink }

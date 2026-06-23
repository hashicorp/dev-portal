/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

export interface InstallPageBannerLink {
	/**
	 * The visible link text. Must appear verbatim somewhere in `description`
	 * so the component can splice it into an anchor inline.
	 */
	text: string
	href: string
}

export interface InstallPageBannerProps {
	/**
	 * Controls the banner color scheme.
	 *
	 * Omit (or leave undefined) to use the page's product brand color
	 * automatically via the `--product-color` CSS custom property — this is
	 * the right default for most products.
	 *
	 * Supply a semantic value only when the notice needs to convey urgency
	 * independent of the product brand (e.g. a deprecation warning).
	 */
	color?: 'warning' | 'critical' | 'neutral'

	/** Plain text body. If `link` is provided, `link.text` will be replaced
	 *  inline with an anchor. */
	description: string

	/** Optional inline link. `link.text` must appear verbatim in `description`. */
	link?: InstallPageBannerLink
}

/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

export interface HeadMetadataProps {
	/**
	 * The title of the current page, will be prepended to the global site title defined in config
	 */
	title?: string

	/**
	 * Description of the current page, render in the meta description tag. Defaults to the value in config
	 */
	description?: string

	/**
	 * Optional custom image path to use as the og-image, relative to
	 * the `/public/og-image` folder.
	 */
	localOgImage?: string
}

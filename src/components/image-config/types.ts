/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import { ImageProps } from 'components/image/types'

export interface ImageConfigProps {
	/**
	 * An MDX `img`, e.g. `![some alt text](path/to/img.jpg)`
	 */
	children: ReactNode

	/**
	 * A caption to display below the image.
	 */
	caption?: string

	/**
	 * Hide borders (temporarily configurable in Learn while we remove
	 * baked-in borders from existing images)
	 */
	hideBorder?: boolean

	/**
	 * An explicit width value to be passed to the image element
	 */
	width?: ImageProps['width']

	/**
	 * An explicit height value to be passed to the image element
	 */
	height?: ImageProps['height']

	/**
	 * Indicate whether or not the rendered image element should be inline
	 */
	inline?: ImageProps['inline']
}

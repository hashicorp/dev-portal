/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import React from 'react'
import { DocsEnterpriseAlert } from './components/enterprise-alert'
import Image from 'components/image'
import { ImageProps } from 'components/image/types'

// This function returns a simple object containing the default components
// The `additionalComponents` param is purely for convenience.
// It is intended for use with `next-mdx-remote`.
export default function defaultMdxComponents({ additionalComponents = {} }) {
	return Object.assign(_defaultComponents(), additionalComponents)
}

/**
 * Returns the Image component configured with specific default behaviour.
 *
 * In /docs, we want to hide image borders by default for now,
 * to match existing behaviour. Note that in /tutorials, we want
 * to show image borders by default. Later we may adjust these
 * defaults; it would likely be ideal for /docs and /tutorials
 * to have the same default behaviour.
 */
function makeImageElement({ noBorder }: { noBorder: ImageProps['noBorder'] }) {
	// eslint-disable-next-line react/display-name
	return ({ alt, src, title }: Pick<ImageProps, 'alt' | 'src' | 'title'>) => (
		<Image alt={alt} src={src} title={title} noBorder={noBorder} />
	)
}

// Purely for sharing between the two functions. Once `createMdxProvider` is
// deprecated, this can be moved inline.
function _defaultComponents() {
	return {
		EnterpriseAlert: DocsEnterpriseAlert,
		img: makeImageElement({ noBorder: true }),
	}
}

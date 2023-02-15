/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { TryHcpCalloutPrebuilt } from 'components/try-hcp-callout'
import { ProductSlugWithContent } from 'components/try-hcp-callout/types'
import s from './mdx-try-hcp-callout.module.css'

function MdxTryHcpCallout({ product }: { product: ProductSlugWithContent }) {
	return (
		<div className={s.spacing}>
			<TryHcpCalloutPrebuilt productSlug={product} />
		</div>
	)
}

export { MdxTryHcpCallout }

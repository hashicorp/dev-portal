/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { FeaturedStackProps } from './types'
import s from './featured-stack.module.css'

function FeaturedStack({
	heading,
	headingSlug,
	subheading,
	children,
}: FeaturedStackProps): React.ReactElement {
	return (
		<div>
			<h2 id={headingSlug} className={s.heading}>
				{heading}
			</h2>
			{subheading ? <p className={s.subheading}>{subheading}</p> : null}
			<div className={s.children}>{children}</div>
		</div>
	)
}

export type { FeaturedStackProps }
export { FeaturedStack }

/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Children, ReactChild } from 'react'
import { isPageHeadingChild } from './utils/is-page-heading-child'
import s from '../../docs-view.module.css'

/**
 * A structured page view that wraps rendered MDX content,
 * but skips rendering <h1> elements.
 *
 * TODO: maybe always use this approach? Might be easier to reason about,
 * and allow positioning of `h1` in `flex` layout with version selector,
 * which applies to _most_ pages as most are versioned.
 */
export default function DocsRootLanding({
	children,
}: {
	children: ReactChild[]
}) {
	/**
	 * Iterate over the content children. We avoid duplicative rendering of
	 * the <h1>, which will be rendered by `DocsView`.
	 */
	const childrenToRender = Children.map(children, (child: ReactChild) =>
		isPageHeadingChild(child) ? null : child
	)

	return <div className={s.mdxContent}>{childrenToRender}</div>
}

/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactChild, ReactFragment, ReactPortal, AwaitedReactNode } from 'react'

/**
 * Given a React child, determine if it a permalink element injected by our
 * `@hashicorp/remark-plugins` `anchor-links` plugin.
 *
 * Return `true` if the element does seem to be an injected permalink,
 * or `false` otherwise.
 *
 * We expect injected permalink elements to have a `__permalink-h` className.
 * Ref: https://github.com/hashicorp/remark-plugins/blob/d7869b253b3ae07116f280f95fe2b414145594f1/plugins/anchor-links/index.js#L155
 */
export function isInjectedPermalink(
	child: ReactChild | ReactFragment | ReactPortal | Promise<AwaitedReactNode>
): boolean {
	const isLiteral = typeof child === 'string' || typeof child === 'number'
	if (isLiteral) {
		return false
	}
	const hasClassName = 'props' in child && 'className' in child.props
	if (!hasClassName) {
		return false
	}
	return child.props.className === '__permalink-h'
}

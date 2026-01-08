/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { isValidElement, type ReactNode } from "react"

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
export function isInjectedPermalink(child: ReactNode): boolean {
	if (!isValidElement(child)) return false

	// props is unknown-ish, so narrow safely
	const className = (child.props as { className?: unknown }).className
	return className === "__permalink-h"
}

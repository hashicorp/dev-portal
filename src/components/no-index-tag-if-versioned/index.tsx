/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Head from 'next/head'

/**
 * Given an `isVersioned` boolean, if `true`, this component
 * renders a `noindex, nofollow` tag in `next/head`.
 *
 * Otherwise, if `isVersioned` is false, returns `null`.
 */
function NoIndexTagIfVersioned({ isVersioned }: { isVersioned: boolean }) {
	if (isVersioned) {
		return (
			<Head>
				<meta name="robots" content="noindex, nofollow" key="robots" />
			</Head>
		)
	}
	return null
}

export default NoIndexTagIfVersioned

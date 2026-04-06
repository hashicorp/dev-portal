/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import Head from 'next/head'

/**
 * Given a `shouldNoIndex` boolean, if `true`, this component
 * renders a `noindex, nofollow` tag in `next/head`.
 *
 * Otherwise, if `shouldNoIndex` is false, returns `null`.
 */
function NoIndexTagForRestrictedDocs({ shouldNoIndex }: { shouldNoIndex: boolean }) {
	if (shouldNoIndex) {
		return (
			<Head>
				<meta name="robots" content="noindex, nofollow" key="robots" />
			</Head>
		)
	}
	return null
}

export default NoIndexTagForRestrictedDocs
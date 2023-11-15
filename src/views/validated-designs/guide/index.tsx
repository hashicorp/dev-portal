/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Head from 'next/head'
import BaseLayout from 'layouts/base-layout'
import MobileMenuLevelsGeneric from 'components/mobile-menu-levels-generic'
import InlineLink from 'components/inline-link'

export default function ValidatedDesignGuideView() {
	return (
		<BaseLayout mobileMenuSlot={<MobileMenuLevelsGeneric />}>
			<Head>
				<meta name="robots" content="noindex, nofollow" />
			</Head>
			<h1>HashiCorp Validated Design Page Template</h1>
			<InlineLink href="/validated-designs">
				Back to Validated Designs landing
			</InlineLink>
		</BaseLayout>
	)
}

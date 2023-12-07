/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Head from 'next/head'
import BaseLayout from 'layouts/base-layout'
import MobileMenuLevelsGeneric from 'components/mobile-menu-levels-generic'
import { HvdCategoryGroup, HvdGuide } from './types'

/**
 * Stub interfaces for how we may model the data for this view
 * Can be updated and adjusted as anyone sees fit based on the needs of the view
 */
export interface ValidatedDesignsLandingProps {
	categoryGroups: HvdCategoryGroup[]
}

export default function ValidatedDesignsLandingView({
	categoryGroups,
}: ValidatedDesignsLandingProps) {
	return (
		<BaseLayout mobileMenuSlot={<MobileMenuLevelsGeneric />}>
			<Head>
				<meta name="robots" content="noindex, nofollow" />
			</Head>
			<h1>{'HashiCorp Validated Designs'}</h1>
			<ul>
				{categoryGroups.map((category: HvdCategoryGroup) => (
					<li key={category.slug}>
						<h2>{category.title}</h2>
						<p>{category.description}</p>
						<ul>
							{category.guides.map((guide: HvdGuide) => (
								<li key={guide.slug}>
									<a href={guide.href}>{guide.title}</a>
								</li>
							))}
						</ul>
					</li>
				))}
			</ul>
		</BaseLayout>
	)
}

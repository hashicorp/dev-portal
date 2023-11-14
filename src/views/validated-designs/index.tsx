/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Head from 'next/head'
import BaseLayout from 'layouts/base-layout'
import MobileMenuLevelsGeneric from 'components/mobile-menu-levels-generic'
import { ProductSlug } from 'types/products'

/**
 * Stub interfaces for how we may model the data for this view
 * Can be updated and adjusted as anyone sees fit based on the needs of the view
 */
export interface ValidatedDesignsLandingProps {
	title: string
	description: string
	categoryGroups: HvdCategoryGroup[]
}

interface HvdCategoryGroup {
	slug: string
	title: string
	description: string
	product: ProductSlug
	guides: HvdGuide[]
}

interface HvdGuide {
	slug: string
	title: string
	description: string
	href: string
}

export default function ValidatedDesignsLandingView({
	title,
	description,
	categoryGroups,
}: ValidatedDesignsLandingProps) {
	return (
		<BaseLayout mobileMenuSlot={<MobileMenuLevelsGeneric />}>
			<Head>
				<meta name="robots" content="noindex, nofollow" />
			</Head>
			<h1>{title}</h1>
			<p>{description}</p>
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

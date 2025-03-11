/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { GetStaticPaths, GetStaticProps } from 'next'
import { PRODUCT_DATA_MAP } from 'data/product-data-map'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import {
	generateTopLevelSidebarNavData,
	generateProductLandingSidebarNavData,
} from 'components/sidebar/helpers'
import CardLink from 'components/card-link'
import {
	CardTitle,
	CardDescription,
	CardFooter,
} from 'components/card/components'
import CardsGridList from 'components/cards-grid-list'
import { BrandedHeaderCard } from 'views/product-integrations-landing/components/branded-header-card'
import { CardBadges } from 'components/tutorial-collection-cards'
import { ProductOption } from 'lib/learn-client/types'

interface PlaygroundPageProps {
	product: (typeof PRODUCT_DATA_MAP)[keyof typeof PRODUCT_DATA_MAP]
	layoutProps: {
		breadcrumbLinks: { title: string; url: string }[]
		navLevels: any[]
	}
}

export default function PlaygroundView({
	product,
	layoutProps,
}: PlaygroundPageProps) {
	return (
		<SidebarSidecarLayout
			breadcrumbLinks={layoutProps.breadcrumbLinks}
			sidebarNavDataLevels={layoutProps.navLevels}
		>
			<BrandedHeaderCard
				productSlug={product.slug}
				heading={`${product.name} Interactive Playgrounds`}
				description="Choose a playground to get started with hands-on learning."
			/>

			{product.playgroundConfig.description && (
				<p className="g-type-body" style={{ marginTop: '32px' }}>
					{product.playgroundConfig.description}
				</p>
			)}

			<div style={{ marginTop: '32px' }}>
				<CardsGridList fixedColumns={2}>
					{product.playgroundConfig.labs.map((playground) => (
						<CardLink
							key={playground.id}
							ariaLabel={playground.name}
							href={`/${product.slug}/playground/${playground.id}`}
						>
							<CardTitle text={playground.name} />
							{playground.description && (
								<CardDescription text={playground.description} />
							)}
							<CardFooter>
								<CardBadges
									badges={playground.products.map(
										(slug) => ProductOption[slug]
									)}
								/>
							</CardFooter>
						</CardLink>
					))}
				</CardsGridList>
			</div>
		</SidebarSidecarLayout>
	)
}

export const getStaticPaths: GetStaticPaths = async () => {
	// Only generate paths for products that have labs configured
	const paths = Object.values(PRODUCT_DATA_MAP)
		.filter((product) => product.playgroundConfig?.labs)
		.map((product) => ({
			params: { productSlug: product.slug },
		}))

	return {
		paths,
		fallback: false,
	}
}

export const getStaticProps: GetStaticProps<PlaygroundPageProps> = async ({
	params,
}) => {
	const productSlug = params?.productSlug as string
	const product = PRODUCT_DATA_MAP[productSlug]

	// Only show playground page if product has labs configured
	if (!product || !product.playgroundConfig?.labs) {
		return {
			notFound: true,
		}
	}

	const breadcrumbLinks = [
		{ title: 'Developer', url: '/' },
		{ title: product.name, url: `/${productSlug}` },
		{ title: 'Playground', url: `/${productSlug}/playground` },
	]

	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(product.name),
		generateProductLandingSidebarNavData(product),
	]

	// Add playground links
	const playgroundMenuItems = [
		{
			title: `${product.name} Playground`,
			fullPath: `/${productSlug}/playground`,
			theme: product.slug,
			isActive: true,
		},
		{
			divider: true,
		},
		{
			heading: 'Playgrounds',
		},
		...product.playgroundConfig.labs.map((playground) => ({
			title: playground.name,
			path: `/${productSlug}/playground/${playground.id}`,
			href: `/${productSlug}/playground/${playground.id}`,
			isActive: false,
		})),
	]

	if (product.playgroundConfig.sidebarLinks) {
		playgroundMenuItems.push(
			{
				divider: true,
			},
			{
				heading: 'Resources',
			},
			...product.playgroundConfig.sidebarLinks.map((link) => ({
				title: link.title,
				path: link.href,
				href: link.href,
				isActive: false,
			}))
		)
	}

	sidebarNavDataLevels.push({
		backToLinkProps: {
			text: `${product.name} Home`,
			href: `/${product.slug}`,
		},
		title: 'Playground',
		menuItems: playgroundMenuItems,
		showFilterInput: false,
		visuallyHideTitle: true,
		levelButtonProps: {
			levelUpButtonText: `${product.name} Home`,
			levelDownButtonText: 'Previous',
		},
	})

	return {
		props: {
			product,
			layoutProps: {
				breadcrumbLinks,
				navLevels: sidebarNavDataLevels,
			},
		},
	}
}

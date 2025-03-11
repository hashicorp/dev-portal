/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { GetStaticPaths, GetStaticProps } from 'next'
import { PRODUCT_DATA_MAP } from 'data/product-data-map'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import InstruqtProvider from 'contexts/instruqt-lab'
import EmbedElement from 'components/lab-embed/embed-element'
import {
	generateTopLevelSidebarNavData,
	generateProductLandingSidebarNavData,
} from 'components/sidebar/helpers'

interface PlaygroundPageProps {
	product: (typeof PRODUCT_DATA_MAP)[keyof typeof PRODUCT_DATA_MAP]
	playgroundId: string
	playgroundName: string
	playgroundDescription: string
	layoutProps: {
		breadcrumbLinks: { title: string; url: string }[]
		navLevels: any[]
	}
}

export default function PlaygroundView({
	product,
	playgroundId,
	playgroundName,
	playgroundDescription,
	layoutProps,
}: PlaygroundPageProps) {
	return (
		<SidebarSidecarLayout
			breadcrumbLinks={layoutProps.breadcrumbLinks}
			sidebarNavDataLevels={layoutProps.navLevels}
		>
			<div>
				<h1 className="g-type-display-3">{playgroundName}</h1>
				<p className="g-type-body" style={{ marginTop: '16px' }}>
					{playgroundDescription}
				</p>
			</div>
			<div style={{ height: '80vh', marginTop: '32px' }}>
				<InstruqtProvider labId={playgroundId} defaultActive isPlayground>
					<EmbedElement />
				</InstruqtProvider>
			</div>
		</SidebarSidecarLayout>
	)
}

export const getStaticPaths: GetStaticPaths = async () => {
	const paths = []

	// Generate paths for each product's playgrounds
	Object.values(PRODUCT_DATA_MAP).forEach((product) => {
		if (product.playgroundConfig?.labs) {
			product.playgroundConfig.labs.forEach((playground) => {
				paths.push({
					params: {
						productSlug: product.slug,
						playgroundId: playground.id,
					},
				})
			})
		}
	})

	return {
		paths,
		fallback: false,
	}
}

export const getStaticProps: GetStaticProps<PlaygroundPageProps> = async ({
	params,
}) => {
	const productSlug = params?.productSlug as string
	const playgroundId = params?.playgroundId as string
	const product = PRODUCT_DATA_MAP[productSlug]

	// Only show playground page if product has labs configured
	if (!product || !product.playgroundConfig?.labs) {
		return {
			notFound: true,
		}
	}

	const playground = product.playgroundConfig.labs.find(
		(p) => p.id === playgroundId
	)
	if (!playground) {
		return {
			notFound: true,
		}
	}

	const breadcrumbLinks = [
		{ title: 'Developer', url: '/' },
		{ title: product.name, url: `/${productSlug}` },
		{ title: 'Playground', url: `/${productSlug}/playground` },
		{
			title: playground.name,
			url: `/${productSlug}/playground/${playgroundId}`,
		},
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
			isActive: false,
		},
		{
			divider: true,
		},
		{
			heading: 'Playgrounds',
		},
		...product.playgroundConfig.labs.map((p) => ({
			title: p.name,
			path: `/${productSlug}/playground/${p.id}`,
			href: `/${productSlug}/playground/${p.id}`,
			isActive: p.id === playgroundId,
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
			playgroundId: playground.instruqtId,
			playgroundName: playground.name,
			playgroundDescription: playground.description,
			layoutProps: {
				breadcrumbLinks,
				navLevels: sidebarNavDataLevels,
			},
		},
	}
}

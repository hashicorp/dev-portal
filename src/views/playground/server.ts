/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { GetStaticProps } from 'next'
import { PRODUCT_DATA_MAP } from 'data/product-data-map'
import { ProductData } from 'types/products'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { SidebarProps } from 'components/sidebar/types'
import {
	generateTopLevelSidebarNavData,
	generateProductLandingSidebarNavData,
} from 'components/sidebar/helpers'

interface PlaygroundPageProps {
	product: ProductData
	labId: string
	layoutProps: {
		breadcrumbLinks: BreadcrumbLink[]
		navLevels: SidebarProps[]
	}
}

export const getStaticProps: GetStaticProps<PlaygroundPageProps> = async ({
	params,
}) => {
	const productSlug = params?.productSlug as string
	const product = PRODUCT_DATA_MAP[productSlug]

	// Only show playground page if product has labs configured
	if (!product || !product.playgroundConfig?.labs?.length) {
		return {
			notFound: true,
		}
	}

	const defaultLab = product.playgroundConfig.labs[0]

	const breadcrumbLinks = [
		{ title: 'Developer', url: '/' },
		{ title: product.name, url: `/${productSlug}` },
		{ title: 'Playground', url: `/${productSlug}/playground` },
	]

	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(product.name),
		generateProductLandingSidebarNavData(product),
	]

	// Add playground links if configured
	if (product.playgroundConfig?.sidebarLinks) {
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
				heading: 'Resources',
			},
			...product.playgroundConfig.sidebarLinks.map((link) => ({
				title: link.title,
				path: link.href,
				href: link.href,
				isActive: false,
			})),
		]
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
	}

	return {
		props: {
			product,
			labId: defaultLab.instruqtId,
			layoutProps: {
				breadcrumbLinks,
				navLevels: sidebarNavDataLevels,
			},
		},
	}
}

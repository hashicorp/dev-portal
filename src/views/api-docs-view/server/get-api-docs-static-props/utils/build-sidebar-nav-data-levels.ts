/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Libraries
import { capitalCase } from 'change-case'
// Global
import { getServicePathSlug } from 'components/open-api-page/utils'
import {
	generateProductLandingSidebarNavData,
	generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'
// Types
import type { ProductData } from 'types/products'
import type { MenuItem, SidebarProps } from 'components/sidebar'

/**
 *Build sidebar menu items for an API docs view
 */
function buildSidebarNavDataLevels({
	serviceIds,
	versionId,
	productData,
	baseUrl,
}: {
	serviceIds: string[]
	productData: ProductData
	baseUrl: string
	versionId?: string
}) {
	/**
	 * Construct sidebar items for services.
	 *
	 * For the single service use case, we ensure the single sidenav link points
	 * to the landing page rather than a specific service URL.
	 */
	const isSingleService = serviceIds.length == 1
	const serviceMenuItems: MenuItem[] = serviceIds.map((serviceId: string) => {
		// basePath varies for versioned API docs
		const basePath = versionId ? `${baseUrl}/${versionId}` : baseUrl
		// build the path, for single services we use an index page only
		const path = isSingleService ? '' : getServicePathSlug(serviceId)
		// build a menu item for this service
		return {
			title: capitalCase(serviceId),
			indexData: true,
			path,
			fullPath: `${basePath}/${path}`,
		}
	})

	/**
	 * Construct the API nav data level, using the service menuItems
	 *
	 * - For single services, we'll only one link, with service name & `baseUrl`.
	 * - For multiple services, we add a link to the index page (at `baseUrl`),
	 *   and include serviceMenuItems after the index item.
	 */
	const apiNavData: SidebarProps = {
		backToLinkProps: {
			text: `${productData.name} Home`,
			href: `/${productData.slug}`,
		},
		title: 'API',
		levelButtonProps: {
			levelUpButtonText: `${productData.name} Home`,
		},
		menuItems: [],
	}
	// Add menuItems
	if (isSingleService) {
		/**
		 * TODO: fix up MenuItem related types.
		 * Task: https://app.asana.com/0/1202097197789424/1202405210286689/f
		 */
		apiNavData.menuItems = serviceMenuItems as $TSFixMe
	} else {
		/**
		 * TODO: fix up MenuItem related types.
		 * Task: https://app.asana.com/0/1202097197789424/1202405210286689/f
		 */
		apiNavData.menuItems = [
			{
				title: 'API',
				fullPath: baseUrl,
				theme: productData.slug,
			},
			{
				divider: true,
			},
			...serviceMenuItems,
		] as $TSFixMe
		apiNavData.visuallyHideTitle = true
	}

	/**
	 * Add top-level and product sidebar levels before the apiNavData level.
	 */
	return [
		generateTopLevelSidebarNavData(productData.name),
		generateProductLandingSidebarNavData(productData),
		apiNavData,
	]
}

export { buildSidebarNavDataLevels }

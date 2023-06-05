/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { Product } from 'types/products'
import { ApiDocsServiceData } from '../../../types'

/**
 * Build breadcrumbs for an API docs view
 */
function buildApiDocsBreadcrumbs({
	productData,
	apiDocs,
	serviceData,
	versionId,
}: {
	// Product data is used for the product landing breadcrumb
	productData: Pick<Product, 'name' | 'slug'>
	// apiDocs provides the API docs path, under the product landing
	apiDocs?: {
		name: string
		url: string | null
	}
	// Optional `versionId`, which will produce a breadcrumb if provided.
	versionId?: string
	// Optional `serviceData`, which will produce a breadcrumb if provided.
	serviceData?: Pick<ApiDocsServiceData, 'name' | 'slug'>
}): BreadcrumbLink[] {
	const breadcrumbLinks: BreadcrumbLink[] = []
	// Landing
	breadcrumbLinks.push({ title: 'Developer', url: '/' })
	// Product landing
	breadcrumbLinks.push({ title: productData.name, url: `/${productData.slug}` })
	// Base path for the API docs
	breadcrumbLinks.push({ title: apiDocs.name, url: apiDocs.url })
	// Add version breadcrumb, if applicable
	if (versionId) {
		breadcrumbLinks.push({
			title: versionId,
			url: `${apiDocs.url}/${versionId}`,
		})
	}
	// Add service breadcrumb, if applicable
	if (serviceData) {
		const url = versionId
			? `${apiDocs.url}/${versionId}/${serviceData.slug}`
			: `${apiDocs.url}/${serviceData.slug}`
		breadcrumbLinks.push({ title: serviceData.name, url })
	}
	// Activate the last breadcrumb, it represents the current page
	breadcrumbLinks[breadcrumbLinks.length - 1].isCurrentPage = true
	// Return the breadcrumbs links
	return breadcrumbLinks
}

export { buildApiDocsBreadcrumbs }

/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { BreadcrumbLink } from 'components/breadcrumb-bar'

interface TutorialsBreadcrumbOptions {
	product: BasePathType
	collection?: BasePathType
	tutorial?: BasePathType
}

type BasePathType = {
	name: string
	filename: string
}

export function getTutorialsBreadcrumb({
	product,
	collection,
	tutorial,
}: TutorialsBreadcrumbOptions): BreadcrumbLink[] {
	const paths: BreadcrumbLink[] = [
		{ title: 'Developer', url: '/' },
		{ title: product.name, url: `/${product.filename}` },
		{
			title: 'Tutorials',
			url: `/${product.filename}/tutorials`,
			isCurrentPage: !collection, // If no collection, we're on product landing
		},
	]

	if (collection) {
		paths.push({
			title: collection.name,
			url: `/${product.filename}/tutorials/${collection.filename}`,
			isCurrentPage: !tutorial, // If no tutorial, we're on collection
		})

		if (tutorial) {
			paths.push({
				title: tutorial.name,
				url: `/${product.filename}/tutorials/${collection.filename}/${tutorial.filename}`,
				isCurrentPage: true,
			})
		}
	}

	return paths
}

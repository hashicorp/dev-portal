/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductData, RootDocsPath } from 'types/products'

const getNavDataFileNameForBasePath = ({
	basePath,
	productData,
}: {
	basePath: string
	productData: ProductData
}) => {
	const matchingRootDocsPath = productData.rootDocsPaths.find(
		(rootDocsPath: RootDocsPath) => {
			return rootDocsPath.path === basePath
		}
	)
	const fileNamePrefix =
		matchingRootDocsPath.navDataPrefix ?? matchingRootDocsPath.path
	return `${fileNamePrefix}-nav-data.json`
}

export { getNavDataFileNameForBasePath }

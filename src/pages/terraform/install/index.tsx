/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { GetStaticProps } from 'next'
import terraformData from 'data/terraform.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateGetStaticProps } from 'views/product-downloads-view/server'
import filterVersions from 'lib/filter-versions'

const VERSION_DOWNLOAD_CUTOFF = '>=1.0.11'

const getStaticProps: GetStaticProps = async () => {
	const generatedGetStaticProps = generateGetStaticProps(
		terraformData as ProductData
	)
	const generatedProps = await generatedGetStaticProps()

	// Filter versions based on VERSION_DOWNLOAD_CUTOFF
	const rawVersions = generatedProps.props?.releases?.versions
	const filteredVersions = filterVersions(rawVersions, VERSION_DOWNLOAD_CUTOFF)
	generatedProps.props.releases.versions = filteredVersions

	// @ts-expect-error - sortedAndFilteredVersions is present on generatedProps.props
	//
	// leverage the same TF-specific version filtering behavior on `.releases.versions`
	generatedProps.props.sortedAndFilteredVersions =
		Object.values(filteredVersions)

	return generatedProps
}

export { getStaticProps }
export default ProductDownloadsView

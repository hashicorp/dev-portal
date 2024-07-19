/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getStaticGenerationFunctions } from 'views/docs-view/server'
import { cachedGetProductData } from 'lib/get-product-data'
import { removeIndexPath } from 'lib/remove-index-path'
// types
import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next'
import { ProductSlug, ProductData, RootDocsPath } from 'types/products'
import { Pluggable } from 'unified'
// product-specific
import remarkSentinel from 'lib/remark-sentinel'
import { getLatestVagrantVmwareVersion } from './get-latest-vagrant-vmware-version'
import { DocsViewProps } from '../types'
import { remarkRewriteImageUrls } from 'lib/remark-plugins/remark-rewrite-image-urls'
import { rewriteImageUrlsForExperimentalContentApi } from './rewrite-image-urls-for-experimental-content-api'

export interface DocsViewPropOptions {
	hideVersionSelector?: boolean
	/**
	 * A human-readable project name that is rendered in the version selector and version alert
	 */
	projectName?: string
}

/**
 * Generates static functions for use in a
 * `pages/<productSlug>/<rootDocsPath>/[...page].tsx` DocsView page file.
 */
export function getRootDocsPathGenerationFunctions(
	productSlug: ProductSlug,
	targetRootDocsPath: string,
	options?: DocsViewPropOptions
): {
	getStaticPaths: GetStaticPaths
	getStaticProps: GetStaticProps<DocsViewProps>
} {
	const productData = cachedGetProductData(productSlug)
	const rootDocsPath = productData.rootDocsPaths.find((rootDocsPath) => {
		return rootDocsPath.path == targetRootDocsPath
	})
	const staticFunctionConfig = {
		baseName: rootDocsPath.shortName || rootDocsPath.name,
		basePath: rootDocsPath.path,
		navDataPrefix: rootDocsPath.navDataPrefix,
		product: productData,
		productSlugForLoader: rootDocsPath.productSlugForLoader,
		basePathForLoader: rootDocsPath.basePathForLoader,
		mainBranch: rootDocsPath.mainBranch,
		getScope: generateGetScope(productData, rootDocsPath),
		options,
	}
	return {
		getStaticPaths: async (context) => {
			// Generate getStaticPaths for this rootDocsPath
			const { getStaticPaths } =
				getStaticGenerationFunctions(staticFunctionConfig)
			// Grab the raw paths using the generated getStaticPaths
			const { paths: rawPaths, ...restStaticPathsResult } =
				await getStaticPaths(context)
			/**
			 * If applicable,  filter out the path used for "custom" docs landing pages
			 * (currently this is only "docs", approach to custom docs landing pages
			 * may change this in the future.)
			 */
			const hasCustomLandingPage = rootDocsPath.path == 'docs'
			const paths = hasCustomLandingPage ? removeIndexPath(rawPaths) : rawPaths
			// Return all generated paths
			return { paths, ...restStaticPathsResult }
		},
		getStaticProps: async (
			context
		): Promise<GetStaticPropsResult<DocsViewProps>> => {
			// Generate getStaticPaths for this rootDocsPath
			const pathParts = (context.params.page || []) as string[]
			const { getStaticProps } = getStaticGenerationFunctions({
				...staticFunctionConfig,
				additionalRemarkPlugins: getAdditionalRemarkPlugins(
					productData,
					rootDocsPath,
					pathParts.join('/')
				),
			})
			return await getStaticProps(context)
		},
	}
}

/**
 * Certain products, like Sentinel, require additional remark plugins.
 */
function getAdditionalRemarkPlugins(
	productData: ProductData,
	rootDocsPath: RootDocsPath,
	currentPath: string
): Pluggable[] {
	//
	const productSlugForLoader =
		rootDocsPath.productSlugForLoader || productData.slug
	//
	let additionalRemarkPlugins = []
	if (productData.slug == 'sentinel' && rootDocsPath.path == 'docs') {
		additionalRemarkPlugins.push(remarkSentinel)
	}
	/**
	 * TODO: should only add asset rewriting for new content monorepo API
	 * if the product has opted-in... so need a feature flag or something here...
	 * but for prototyping purposes, trying this out for all products.
	 */
	additionalRemarkPlugins.push(
		remarkRewriteImageUrls({
			urlRewriteFn: (url) =>
				rewriteImageUrlsForExperimentalContentApi(
					url,
					currentPath,
					productSlugForLoader,
					rootDocsPath.path
				),
		})
	)

	return additionalRemarkPlugins
}

/**
 * Certain products, like Vagrant, require specific MDX scope.
 */
type MdxScope = Record<string, unknown>

/**
 * Certain products, like Vagrant, require specific MDX scope.
 */
function generateGetScope(
	productData: ProductData,
	rootDocsPath: RootDocsPath
): () => Promise<MdxScope> {
	if (productData.slug == 'vagrant' && rootDocsPath.path == 'docs') {
		return async () => ({
			VMWARE_UTILITY_VERSION: await getLatestVagrantVmwareVersion(),
		})
	} else {
		return undefined
	}
}

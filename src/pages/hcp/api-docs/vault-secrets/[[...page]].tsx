/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// View
import ApiDocsView from 'views/api-docs-view'
import {
	getApiDocsStaticProps,
	getApiDocsStaticPaths,
	ApiDocsParams,
} from 'views/api-docs-view/server'
import { buildApiDocsBreadcrumbs } from 'views/api-docs-view/server/get-api-docs-static-props/utils'
import { fetchCloudApiVersionData } from 'views/api-docs-view/utils'
// Revised view
import OpenApiDocsView from 'views/open-api-docs-view'
import {
	getStaticPaths as getOpenApiDocsStaticPaths,
	getStaticProps as getOpenApiDocsStaticProps,
} from 'views/open-api-docs-view/server'
// Components
import {
	PathTruncationAside,
	truncateVaultSecretsOperationPath,
} from 'views/api-docs-view/components'
// Types
import type { OperationObjectType } from 'components/open-api-page/types'
import type { ApiDocsViewProps } from 'views/api-docs-view/types'
import type {
	GetStaticPaths,
	GetStaticProps,
	GetStaticPropsContext,
} from 'next'
import type {
	OpenApiDocsViewProps,
	OpenApiNavItem,
} from 'views/open-api-docs-view/types'
import { isDeployPreview } from 'lib/env-checks'

/**
 * 🚩 Flag to use the work-in-progress revised API docs view & server functions.
 */
const USE_REVISED_TEMPLATE =
	__config.flags.enable_hcp_vault_secrets_api_docs_revision

/**
 * The product slug is used to fetch product data for the layout.
 */
const PRODUCT_SLUG = 'hcp'

/**
 * The baseUrl is used to generate
 * breadcrumb links, sidebar nav levels, and version switcher links.
 */
const BASE_URL = '/hcp/api-docs/vault-secrets'

/**
 * Resource items are shown in the sidebar
 */
const NAV_RESOURCE_ITEMS: OpenApiNavItem[] = [
	{
		title: 'Tutorial Library',
		href: '/tutorials/library?product=vault&edition=hcp',
	},
	{
		title: 'Certifications',
		href: '/certifications/security-automation',
	},
	{
		title: 'Community',
		href: 'https://discuss.hashicorp.com/',
	},
	{
		title: 'Support',
		href: 'https://www.hashicorp.com/customer-success',
	},
]

/**
 * We source version data from a directory in the `hcp-specs` repo.
 * See `fetchCloudApiVersionData` for details.
 */
const GITHUB_SOURCE_DIRECTORY = {
	owner: 'hashicorp',
	repo: 'hcp-specs',
	path: 'specs/cloud-vault-secrets',
	ref: 'main',
}

/**
 * Data to power the status page indicator in the header area.
 */
const STATUS_INDICATOR_CONFIG = {
	pageUrl: 'https://status.hashicorp.com',
	endpointUrl:
		'https://status.hashicorp.com/api/v2/components/hk67zg2j2rkd.json',
}

/**
 * Render `<ApiDocsView />` with custom operation path truncation
 * for HCP Vault secrets.
 */
function HcpVaultSecretsApiDocsView(
	props: ApiDocsViewProps | OpenApiDocsViewProps
) {
	/**
	 * 🚩 If the flag is enabled, use the revised template
	 */
	if ('IS_REVISED_TEMPLATE' in props) {
		return <OpenApiDocsView {...props} />
	}

	/**
	 * Otherwise, use the existing API docs view
	 */
	return (
		<ApiDocsView
			{...props}
			massagePathFn={truncateVaultSecretsOperationPath}
			renderOperationIntro={({ data }: { data: OperationObjectType }) => (
				<PathTruncationAside path={data.__path} />
			)}
		/>
	)
}

/**
 * Get static paths, using `versionData` fetched from GitHub.
 */
export const getStaticPaths: GetStaticPaths<ApiDocsParams> = async (ctx) => {
	/**
	 * 🚩 If the flag is enabled, use the revised template
	 */
	if (USE_REVISED_TEMPLATE) {
		return await getOpenApiDocsStaticPaths(ctx)
	}

	/**
	 * Otherwise, use the existing API docs view
	 */
	// If we are in a deploy preview, don't pre-render any paths
	if (isDeployPreview()) {
		return { paths: [], fallback: 'blocking' }
	}
	// Otherwise, fetch version data, and use that to generate paths
	const versionData = await fetchCloudApiVersionData(GITHUB_SOURCE_DIRECTORY)
	return await getApiDocsStaticPaths({ productSlug: PRODUCT_SLUG, versionData })
}

/**
 * Get static props, using `versionData` fetched from GitHub.
 *
 * We need all version data for the version selector,
 * and of course we need specific data for the current version.
 */
export const getStaticProps: GetStaticProps<
	ApiDocsViewProps | OpenApiDocsViewProps,
	ApiDocsParams
> = async ({ params }: GetStaticPropsContext<ApiDocsParams>) => {
	// Fetch all version data, based on remote `stable` & `preview` subfolders
	const versionData = await fetchCloudApiVersionData(GITHUB_SOURCE_DIRECTORY)
	// If we can't find any version data at all, render a 404 page.
	if (!versionData) {
		return { notFound: true }
	}

	/**
	 * 🚩 If the flag is enabled, use the revised template
	 */
	if (USE_REVISED_TEMPLATE) {
		return await getOpenApiDocsStaticProps({
			basePath: BASE_URL,
			context: { params },
			productSlug: PRODUCT_SLUG,
			statusIndicatorConfig: STATUS_INDICATOR_CONFIG,
			navResourceItems: NAV_RESOURCE_ITEMS,
			// Handle rename of `targetFile` to `sourceFile` for new template
			versionData: versionData.map(({ targetFile, ...rest }) => {
				return { ...rest, sourceFile: targetFile }
			}),
		})
	}

	/**
	 * Otherwise, use the existing API docs view
	 */
	// Return static props
	const staticPropsResult = await getApiDocsStaticProps({
		productSlug: PRODUCT_SLUG,
		baseUrl: BASE_URL,
		pathParts: params.page,
		versionData,
		buildCustomBreadcrumbs: ({ productData, serviceData, versionId }) => {
			return buildApiDocsBreadcrumbs({
				productData,
				// HCP API docs at `/api-docs` are not linkable, so we pass url=null
				apiDocs: { name: 'API', url: null },
				serviceData,
				versionId,
			})
		},
	})
	/**
	 * Shims specific to HCP Vault Secrets
	 */
	if (!('props' in staticPropsResult)) {
		return staticPropsResult
	}
	// We shim in the removal of the service name, as it's redundant.
	staticPropsResult.props.serviceData.name = ''
	// Return the static props results with shimmed modifications
	return staticPropsResult
}

export default HcpVaultSecretsApiDocsView

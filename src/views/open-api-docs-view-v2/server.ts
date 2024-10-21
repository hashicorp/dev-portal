/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getNavItems } from './utils/get-nav-items'
import { parseAndValidateOpenApiSchema } from 'lib/api-docs/parse-and-validate-open-api-schema'
// Utils
import getOperationContentProps from './components/operation-content/server'
import getLandingContentProps from './components/landing-content/server'
import { getOperationObjects } from './utils/get-operation-objects'
import { buildOperationGroups } from './utils/build-operation-groups'
import { wordBreakCamelCase } from './utils/word-break-camel-case'
// Types
import type {
	OpenApiDocsViewV2Props,
	OpenApiNavItem,
	SharedProps,
} from 'views/open-api-docs-view-v2/types'
// import { stripUndefinedProperties } from 'lib/strip-undefined-props'

/**
 * TODO: lift this content up so it can vary page-to-page
 *
 * THOUGHT: rather than require custom YAML, maybe we should use a second layer
 * of "tags" to group operations further? Maybe the custom YAML could be used
 * at the "spec hook" stage... to add that second layer of tags. And then our
 * operation grouping logic could be based on tags. This would open the door
 * to have these changes made at the content source in the near future (at
 * which point we'd remove the "spec hook" stage).
 *
 * Reference doc:
 * https://swagger.io/docs/specification/v3_0/grouping-operations-with-tags/
 */
const SHIM_CONTENT = {
	operationGroupings: [
		{
			title: 'Apps',
			operationIds: [
				'CreateApp',
				'ListApps',
				'GetApp',
				'UpdateApp',
				'DeleteApp',
			],
		},
		{
			title: 'Secrets',
			operationIds: [
				'CreateAppKVSecret',
				'OpenAppSecrets',
				'OpenAppSecret',
				'ListAppSecrets',
				'GetAppSecret',
				'DeleteAppSecret',
			],
		},
		{
			title: 'Secret Versions',
			operationIds: [
				'ListAppSecretVersions',
				'ListOpenAppSecretVersions',
				'OpenAppSecretVersion',
				'GetAppSecretVersion',
				'DeleteAppSecretVersion',
			],
		},
		{
			title: 'Sync Integrations',
			operationIds: [
				'CreateAwsSmSyncIntegration',
				'CreateAzureKvSyncIntegration',
			],
		},
		{
			title: 'Sync Integrations',
			operationIds: [
				'CreateGcpSmSyncIntegration',
				'CreateGhOrgSyncIntegration',
				'CreateGhRepoSyncIntegration',
			],
		},
		{
			title: 'GitHub Installations',
			operationIds: [
				'ListGitHubInstallations',
				'ConnectGitHubInstallation',
				'GetGitHubInstallLinks',
			],
		},
		// ForceSync
		// SetTier
	],
}

export async function getStaticProps({
	basePath,
	operationSlug,
	openApiJsonString,
}: {
	basePath: string
	operationSlug?: string
	openApiJsonString: string
}): Promise<OpenApiDocsViewV2Props> {
	/**
	 * Fetch, parse, and validate the OpenAPI schema for this version.
	 */
	const schemaData = await parseAndValidateOpenApiSchema(openApiJsonString)

	/**
	 * Gather props common to both the "landing" and "operation" views, namely:
	 *
	 * - basePath - base path from the dev dot URL, eg `/hcp/some-api-docs`
	 * - navItems - links for the sidebar
	 *
	 * TODO: add breadcrumb bar. Or, could be done separately for each view,
	 * if we have well-abstracted composable functions to build breadcrumbs?
	 * (maybe already started, build breadcrumb from URL path segments?)
	 *
	 * TODO: version selector. Probably needs to come a little later, but
	 * seems like something that would be duplicated pretty exactly between
	 * the landing and operation views. That being said, maybe there's an
	 * opportunity here to build a clever linking strategy so that we don't
	 * link to 404s... most basic version might be "always link to the root of
	 * the current version, and let the user navigate from there."... but more
	 * complex version may end up meaning significant differences in the logic
	 * to generate the version selector depending on landing vs operation view.
	 */
	const operationObjects = getOperationObjects(schemaData)
	const operationGroups = buildOperationGroups(
		SHIM_CONTENT.operationGroupings,
		operationObjects
	)
	const navItemLanding: OpenApiNavItem = {
		title: 'Landing',
		fullPath: basePath,
		isActive: !operationSlug,
	}
	const navItemGroups = operationGroups.map((group) => ({
		title: group.title,
		items: group.operationObjects.map(({ type, operationId }) => {
			return {
				title: wordBreakCamelCase(operationId),
				fullPath: `${basePath}/${operationId}`,
				isActive: operationSlug === operationId,
			}
		}),
	}))
	const sharedProps: SharedProps = {
		basePath,
		navItemLanding,
		navItemGroups,
	}

	/**
	 * If we have an operation slug, build and return operation view props.
	 * Otherwise, assume a landing view, and build and return landing view props.
	 */
	if (operationSlug) {
		const operationContentProps = await getOperationContentProps(
			operationSlug,
			schemaData
		)
		return { ...sharedProps, operationContentProps }
	} else {
		const landingContentProps = await getLandingContentProps(schemaData)
		return { ...sharedProps, landingContentProps }
	}
}

/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getNavItems } from './utils/get-nav-items'
import { parseAndValidateOpenApiSchema } from 'lib/api-docs/parse-and-validate-open-api-schema'
// Utils
import getOperationContentProps from './components/operation-content/server'
import getLandingContentProps from './components/landing-content/server'
// Types
import type {
	OpenApiDocsViewV2Props,
	SharedProps,
} from 'views/open-api-docs-view-v2/types'

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
	const navItems = getNavItems(basePath, operationSlug, schemaData)
	const sharedProps: SharedProps = { basePath, navItems }

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

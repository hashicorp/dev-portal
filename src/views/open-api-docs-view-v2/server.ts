/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { parseAndValidateOpenApiSchema } from 'lib/api-docs/parse-and-validate-open-api-schema'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import isAbsoluteUrl from 'lib/is-absolute-url'
// Utils
import getOperationContentProps from './components/operation-content/server'
import getLandingContentProps from './components/landing-content/server'
import {
	getOperationObjects,
	OperationObject,
} from './utils/get-operation-objects'
import { wordBreakCamelCase } from './utils/word-break-camel-case'
import { groupItemsByKey } from './utils/group-items-by-key'
import { cachedGetProductData } from 'lib/get-product-data'
// Types
import type {
	OpenApiDocsViewV2Props,
	SharedProps,
	OpenApiDocsViewV2Config,
} from 'views/open-api-docs-view-v2/types'

/**
 * Build static props for an OpenAPI docs view.
 *
 * There are two main views:
 * - Landing view, for the basePath, when no operationSlug is provided
 * - Operation view, for the specific operationSlug that's been provided
 */
export async function getStaticProps({
	basePath,
	getOperationGroupKey = (o: OperationObject) =>
		(o.tags.length && o.tags[0]) ?? 'Other',
	openApiJsonString,
	operationSlug,
	schemaTransforms,
	theme = 'hcp',
	backToLink,
	resourceLinks = [],
}: OpenApiDocsViewV2Config): Promise<OpenApiDocsViewV2Props> {
	/**
	 * Grab product data for this context
	 */
	const productData = cachedGetProductData(theme)

	/**
	 * Fetch, parse, and validate the OpenAPI schema for this version.
	 */
	const rawSchemaData = await parseAndValidateOpenApiSchema(openApiJsonString)

	/**
	 * Apply any schema transforms.
	 */
	let schemaData = rawSchemaData
	for (const schemaTransformFunction of schemaTransforms ?? []) {
		schemaData = schemaTransformFunction(schemaData)
	}

	/**
	 * TODO: add breadcrumb bar. Or, could be done separately for each view,
	 * if we have well-abstracted composable functions to build breadcrumbs?
	 * (maybe already started, build breadcrumb from URL path segments?)
	 */

	/**
	 * TODO: version selector. Probably needs to come a little later, but
	 * seems like something that would be duplicated pretty exactly between
	 * the landing and operation views. That being said, maybe there's an
	 * opportunity here to build a clever linking strategy so that we don't
	 * link to 404s... most basic version might be "always link to the root of
	 * the current version, and let the user navigate from there."... but more
	 * complex version may end up meaning significant differences in the logic
	 * to generate the version selector depending on landing vs operation view.
	 */

	/**
	 * Build links for the sidebar.
	 */
	const operationObjects = getOperationObjects(schemaData)
	const operationGroups = groupItemsByKey(
		operationObjects,
		getOperationGroupKey
	)
	const landingLink = {
		theme,
		text: schemaData.info.title,
		href: basePath,
		isActive: !operationSlug,
	}
	const operationLinkGroups = operationGroups.map((group) => ({
		// Note: we word break to avoid long strings breaking the sidebar layout
		text: wordBreakCamelCase(group.key),
		items: group.items.map(({ operationId }) => {
			return {
				text: wordBreakCamelCase(operationId),
				href: `${basePath}/${operationId}`,
				isActive: operationSlug === operationId,
			}
		}),
	}))

	/**
	 * Gather props shared between the landing and individual operation views.
	 */
	const sharedProps: SharedProps = {
		basePath,
		backToLink,
		landingLink,
		operationLinkGroups,
		productData,
		resourceLinks: resourceLinks.map((item) => {
			return { ...item, isExternal: isAbsoluteUrl(item.href) }
		}),
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
		return stripUndefinedProperties({ ...sharedProps, operationContentProps })
	} else {
		const landingContentProps = await getLandingContentProps(schemaData)
		return stripUndefinedProperties({ ...sharedProps, landingContentProps })
	}
}

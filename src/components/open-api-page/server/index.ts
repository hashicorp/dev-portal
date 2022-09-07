import { capitalCase } from 'change-case'
import {
	getServicePathSlug,
	getOperationObjects,
	getServiceId,
	getServiceIds,
} from '../utils'
import {
	processSchema,
	processSchemaFile,
	processSchemaString,
} from './process-schema'

/**
 * Given a schema, current service slug, and parentPath,
 * return all props needed for an openapi component page.
 *
 * @param {*} schema
 * @param {*} params
 * @returns
 */
function getPropsForPage(schema, params) {
	// parse the data we'll show to the user from the schema
	const operationObjects = getOperationObjects(schema)
	const serviceIds = getServiceIds(operationObjects)
	// info and sidenav data are needed on all pages
	const info = schema.info
	const navData = serviceIds.map((serviceId) => {
		return {
			title: capitalCase(serviceId),
			indexData: true,
			path: getServicePathSlug(serviceId),
		}
	})
	// If there is only a single service,
	// we'll display that service on the landing page
	const isSingleService = navData.length == 1
	// For the single service use case,
	// we also ensure the single sidenav link points to the landing page
	// rather than a specific operation-slug-based path as it would otherwise
	if (isSingleService) {
		navData[0].path = ''
	}
	// If there's no "page" param, then this is the landing page
	const currentPath = params && params.page ? params.page.join('/') : ''
	const isLanding = !params || !params.page || currentPath == ''
	// For landing pages, we don't need to return operationCategory data,
	// so we return early
	if (isLanding && !isSingleService) {
		return { info, navData, currentPath }
	}
	// Otherwise, we should have an operationCategory that matches the slug-ified ID from the URL path
	const targetServiceId = isSingleService
		? getServicePathSlug(serviceIds[0])
		: params.page[0]
	const operationCategory = serviceIds
		.filter((id) => getServicePathSlug(id) === targetServiceId)
		.map((serviceId) => {
			const name = capitalCase(serviceId)
			const slug = getServicePathSlug(serviceId)
			const operations = operationObjects.filter(
				(o) => getServiceId(o) === serviceId
			)
			return { name, slug, operations }
		})[0]
	return { info, navData, operationCategory, currentPath }
}

/**
 * Given a schema,
 * return all the paths we'll render for our openapi generated docs
 *
 * @param {*} schema
 * @returns
 */
function getPathsFromSchema(schema) {
	// Assign each operation category to a URL using its slug-ified ID
	const operationObjects = getOperationObjects(schema)
	const slugs = getServiceIds(operationObjects).map(getServicePathSlug)
	// If this is a single service, just return an index page
	const isSingleService = slugs.length === 1
	if (isSingleService) {
		return [{ params: { page: [] } }]
	}
	// Otherwise, return path entries for each service, as well
	// as well as an index path entry
	// We need a path for each "service"
	const paths = slugs.map((slug) => ({ params: { page: [slug] } }))
	paths.push({ params: { page: [] } })
	return paths
}

export {
	processSchema,
	processSchemaFile,
	processSchemaString,
	getPropsForPage,
	getPathsFromSchema,
	getServiceIds,
}

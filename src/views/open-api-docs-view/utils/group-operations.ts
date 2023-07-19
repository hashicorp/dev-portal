import { OperationProps, OperationGroup } from '../types'
import { truncateHcpOperationPath } from '../utils'

/**
 * Given a flat array of operation prop objects,
 * Return an array of operation groups
 *
 * Operation groups are constructed by organizing the incoming
 * operation prop objects by their paths.
 */
export function groupOperations(
	operationObjects: OperationProps[]
): OperationGroup[] {
	const operationGroupsMap = operationObjects.reduce(
		(
			acc: Record<string, { heading: string; items: OperationProps[] }>,
			o: OperationProps
		) => {
			const truncatedPath = truncateHcpOperationPath(o._placeholder.__path)
			const firstPathPart = truncatedPath.split('/').slice(0, 3).join('/')
			const pathGroupSlug = firstPathPart
			if (!acc[pathGroupSlug]) {
				acc[pathGroupSlug] = {
					heading: pathGroupSlug,
					items: [],
				}
			}
			acc[pathGroupSlug].items.push(o)
			return acc
		},
		{} as Record<string, OperationGroup>
	)

	return Object.values(operationGroupsMap)
}

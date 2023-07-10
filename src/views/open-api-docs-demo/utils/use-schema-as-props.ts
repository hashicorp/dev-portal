import { useMemo } from 'react'
import { getOperationProps, groupOperations } from '.'
import { OpenApiDocsViewProps, OpenApiSchema } from '../types'

/**
 * Given a schema object,
 * Return props for an Open API docs view.
 */
export function useSchemaAsProps(
	schemaJson: OpenApiSchema | { error: string }
): OpenApiDocsViewProps | null {
	const viewProps = useMemo(() => {
		if (!schemaJson || 'error' in schemaJson) {
			return null
		}
		const operationObjects = getOperationProps(schemaJson)
		const operationGroups = groupOperations(operationObjects)
		return { operationObjects, operationGroups, _schema: schemaJson }
	}, [schemaJson])

	return viewProps
}

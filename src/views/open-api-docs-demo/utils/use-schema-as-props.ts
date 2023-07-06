import { useMemo } from 'react'
import { getOperationObjects } from '.'
import { OpenApiDocsViewProps, SchemaJson } from '../types'

/**
 * Given a schema object,
 * Return props for an Open API docs view.
 */
export function useSchemaAsProps(
	schemaJson: SchemaJson
): OpenApiDocsViewProps | null {
	const viewProps = useMemo(() => {
		if (!schemaJson || 'error' in schemaJson) {
			return null
		}
		const operationObjects = getOperationObjects(schemaJson)
		return { operationObjects, _schema: schemaJson }
	}, [schemaJson])

	return viewProps
}

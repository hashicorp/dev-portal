import { OpenAPIV3_1 } from 'openapi-types'

type DataForPrototyping = $TSFixMe

export type OperationGroup = { heading: string; items: OperationProps[] }

export interface ParameterProps {
	name: string
}

export interface OperationProps {
	operationId: string
	slug: string
	queryParameters?: ParameterProps[]
	pathParameters?: ParameterProps[]
	bodyParameters?: ParameterProps[]
	summary?: string
	_data: DataForPrototyping
}

export interface OpenApiDocsViewProps {
	operationGroups: OperationGroup[]
	_schema: OpenApiSchema
}

/**
 * Note: there are significant enough differences between schema versions
 * that working with different schema versions in a single function
 * doesn't seem feasible (or rather, worth the complexity compared to
 * splitting out separate functions if we need to support multiple versions).
 */
export type OperationSchema = OpenAPIV3_1.OperationObject
export type ParametersSchema = OpenAPIV3_1.ParameterObject[]
export type ParameterSchema = OpenAPIV3_1.ParameterObject
export type OpenApiSchema = OpenAPIV3_1.Document

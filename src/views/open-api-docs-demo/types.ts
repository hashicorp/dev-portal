import { OpenAPI } from 'openapi-types'

type DataForPrototyping = $TSFixMe

export type OperationGroup = { heading: string; items: OperationProps[] }

export interface OperationProps {
	operationId: string
	slug: string
	summary?: string
	_data: DataForPrototyping
}

export interface OpenApiDocsViewProps {
	operationGroups: OperationGroup[]
	_schema: OpenApiSchema
}

type OpenApiSchema = OpenAPI.Document
export type { OpenApiSchema }

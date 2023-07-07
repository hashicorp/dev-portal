import { OpenAPI } from 'openapi-types'

type DataForPrototyping = $TSFixMe

export interface OperationProps {
	operationId: string
	slug: string
	summary?: string
	_data: DataForPrototyping
}

export interface OpenApiDocsViewProps {
	operationObjects: OperationProps[]
	_schema: OpenApiSchema
}

type OpenApiSchema = OpenAPI.Document
export type { OpenApiSchema }

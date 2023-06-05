/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

export interface Response {
	/** Passed to the <ResponseObject /> component. We only support "200" response codes, for now. */
	200: Record<'schema', SchemaType>
}

export interface SchemaType {
	/** A [Schema Object](https://swagger.io/specification/v2/#schema-object) that describes the response. Note that we currently only support objects (with schema.properties) responses in the UI. */
	properties: Record<string, ParameterType>
}

export interface OperationObjectType {
	/** The request type associated with the object */
	__type: 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch'
	/** The operation path */
	__path: string
	/** Flag whether this operation is deprecated */
	deprecated: boolean
	/** A unique string used to identify the operation.*/
	operationId: string
	/** A short summary of the operation. Markdown is supported. */
	summary?: string
	/** Responses object, keys are HTTP response codes */
	responses: Response
	/** Array of parameter objects. In the UI, parameters are grouped by "query" / "path" / "body". */
	parameters: ParameterType[]
}

export interface ParameterType {
	/** The name of the parameter. Parameter names are case sensitive. */
	name: string
	/** A brief, plain text description of the parameter. Note that [GitHub-flavor markdown](https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown) is not currently supported. */
	description: string
	/** Indicates whether this parameter is mandatory. */
	required: boolean
	/** The location of the parameter. Note: `formData` and `header` are not currently supported in the UI. */
	in: 'query' | 'path' | 'body'
	/** Schema is used for "body" parameters. */
	schema: Record<string, unknown>
	/** Type defines the parameter type, for non-"body" parameters. */
	type: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string'
}

// import SwaggerParser from '@apidevtools/swagger-parser'

export async function parseAndValidateOpenApiSchema(fileString: string) {
	const rawSchemaJson = JSON.parse(fileString)
	// TODO: add validation
	const schemaJson = rawSchemaJson
	// const schemaJson = await SwaggerParser.validate(rawSchemaJson, {
	// 	dereference: { circular: false },
	// })
	return schemaJson
}

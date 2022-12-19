import fs from 'fs'
import RefParser from '@apidevtools/json-schema-ref-parser'
import traverse from '../utils/traverse'
import markdownToHtml from '@hashicorp/platform-markdown-utils/markdown-to-html'

async function processMarkdownProperties(object) {
	const TARGET_PROPERTIES = ['description', 'summary', 'title']
	const withMarkdownAsHtml = await traverse(object, async (key, value) => {
		// Only process markdown in specific scenarios
		if (TARGET_PROPERTIES.indexOf(key) == -1) {
			return value
		}
		if (typeof value !== 'string') {
			return value
		}
		// If we have a string with a target key, then process it
		return await markdownToHtml(value)
	})
	return withMarkdownAsHtml
}

async function processSchema(schemaJson) {
	const withMarkdownAsHtml = {
		...schemaJson,
		paths: await processMarkdownProperties(schemaJson.paths),
		definitions: await processMarkdownProperties(schemaJson.definitions),
	}
	return await RefParser.dereference(withMarkdownAsHtml)
}

async function processSchemaString(jsonString) {
	return await processSchema(JSON.parse(jsonString))
}

async function processSchemaFile(filePath) {
	return await processSchemaString(fs.readFileSync(filePath))
}

export { processSchema, processSchemaFile, processSchemaString }

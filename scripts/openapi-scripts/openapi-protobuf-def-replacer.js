/**
 * Note: requires GITHUB_TOKEN environment variable to be set.
 * Run like:
 * GITHUB_TOKEN=your_token_here node openapi-protobuf-def-replacer.js
 */

//@ts-check

const fs = require('fs')
const fetchGithubFile = require('./fetch-github-file')

main()

async function main() {
	// Fetch the OpenAPI file (could read in local file here instead)
	const openApiFileString = await fetchGithubFile({
		owner: 'hashicorp',
		repo: 'hcp-specs',
		path: 'specs/cloud-vault-secrets/stable/2023-06-13/hcp.swagger.json',
		ref: 'main',
	})
	// Parse the JSON
	const openApiSpec = JSON.parse(openApiFileString)
	/**
	 * Clone the original spec, replacing the long descriptions in the
	 * protobufAny definition with shorter ones
	 */
	const withNewProtobufDef = cloneAndModify(
		openApiSpec,
		['definitions', 'protobufAny', 'description'],
		'An arbitrary serialized message. Visit the [protobufAny documentation](https://protobuf.dev/reference/protobuf/google.protobuf/#any) for more information.'
	)
	const withNewProtobufTypeDef = cloneAndModify(
		withNewProtobufDef,
		['definitions', 'protobufAny', 'properties', '@type', 'description'],
		'A URL that describes the type of the serialized message.'
	)
	// Write out the modified OpenAPI file
	const jsonString = JSON.stringify(withNewProtobufTypeDef, null, 2)
	fs.writeFileSync('modified.swagger.json', jsonString)
}

/**
 * Given an object, a path to a value within the object,
 * and a value to replace the existing value at that path,
 * Return a cloned object with the value at the path replaced.
 *
 * If the key path does not exist in the object, throw an error.
 *
 * @param {Record<string, any>} object
 * @param {string[]} keyPath
 * @param {any} newValue
 * @param {string[]} prevKeys
 */
function cloneAndModify(object, keyPath, newValue, prevKeys = []) {
	// Base case: end of the key path, replace the value
	if (keyPath.length === 0) {
		return newValue
	}
	// Recursive case: clone the object and modify the next key, if it exists
	const [firstKey, ...restKeys] = keyPath
	// If the property we expect to access with this key doesn't exist,
	// throw an error
	if (!(firstKey in object)) {
		throw new Error(
			`Error: attempting to clone and modify object, but could not find value at key path ${[
				...prevKeys,
				firstKey,
			].join('.')}. Exiting.`
		)
	}
	// Otherwise, update the object, and return it
	return {
		...object,
		[firstKey]: cloneAndModify(object[firstKey], restKeys, newValue, [
			...prevKeys,
			firstKey,
		]),
	}
}

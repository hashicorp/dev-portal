/**
 * Modifies an incoming `schemaData`, which is expected to be a valid OpenAPI
 * schema, in order to replace "HashiCorp Cloud Platform" with "HCP" in the
 * title of the schema.
 */
export default function shortenToHcpInTitle(schemaData: unknown): unknown {
	if (
		typeof schemaData === 'object' &&
		'info' in schemaData &&
		typeof schemaData.info === 'object' &&
		'title' in schemaData.info &&
		typeof schemaData.info.title === 'string'
	) {
		const modifiedTitle = schemaData.info.title.replace(
			'HashiCorp Cloud Platform',
			'HCP'
		)
		return { ...schemaData, info: { ...schemaData.info, title: modifiedTitle } }
	} else {
		return schemaData
	}
}

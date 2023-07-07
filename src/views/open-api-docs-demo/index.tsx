// Third-party
import { useState } from 'react'
// Layout
import BaseNewLayout from 'layouts/base-new'
// Components
import Text from 'components/text'
// Local
import OpenApiDocsView from './open-api-docs-view'
import { DevCodeBlock, InputSection } from './components'
import { useSchemaJson, useSchemaAsProps } from './utils'
// Default fixture value
import HCP_VAULT_SECRETS_SCHEMA from './fixtures/hcp-vault-secrets.swagger.json'
// Styles
import s from './open-api-docs-demo.module.css'

/**
 * Use the HCP Vault Secrets schema as the default value, stringify it first.
 *
 * This is kind of silly, but when we load actual schemas we'll be getting
 * a string value, so feels worth it to avoid having to refactor anything
 * once we're ready to move into more of a production-ish setup.
 */
const DEFAULT_SCHEMA_FILE_STRING = JSON.stringify(
	HCP_VAULT_SECRETS_SCHEMA,
	null,
	2
)

/**
 * Render the input section and display section together.
 *
 * Broad list of tools that may be helpful:
 * - https://openapi.tools/
 *
 * Specific tools that may be helpful:
 * - https://github.com/readmeio/oas-normalize - parse out the spec, deref
 * - https://github.com/ErikWittern/openapi-snippet - generate snippets
 * - https://api.readme.dev/docs - just cool, not useful here
 */
function OpenApiDocsDemoView() {
	const [schemaFileString, setSchemaFileString] = useState(
		DEFAULT_SCHEMA_FILE_STRING
	)
	const schemaJson = useSchemaJson(schemaFileString)

	/**
	 * Parse out props from the incoming OpenAPI schema.
	 *
	 * In a production implementation, this would be done in
	 * getStaticProps, I think, since the result won't change
	 * if the schema doesn't change.
	 */
	const viewProps = useSchemaAsProps(schemaJson)

	return (
		<BaseNewLayout showFooterTopBorder>
			<div className={s.root}>
				<InputSection
					fileString={schemaFileString}
					setFileString={setSchemaFileString}
				/>
				{viewProps !== null ? (
					<OpenApiDocsView {...viewProps} />
				) : (
					<div className={s.error}>
						<Text>Invalid Schema Data</Text>
						<DevCodeBlock>{JSON.stringify(schemaJson, null, 2)}</DevCodeBlock>
					</div>
				)}
			</div>
		</BaseNewLayout>
	)
}

export default OpenApiDocsDemoView

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
// Styles
import s from './open-api-docs-demo.module.css'

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
	const [schemaFileString, setSchemaFileString] = useState('')
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

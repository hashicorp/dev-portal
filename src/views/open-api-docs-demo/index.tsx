// Third-party
import { useMemo, useState } from 'react'
// Layout
import BaseNewLayout from 'layouts/base-new'
// Components
import AccordionDisclosure from 'components/accordion-disclosure'
import Text from 'components/text'
// Local
import { DevCodeBlock, InputSection } from './components'
import { getOperationObjects, getPathItemObjects } from './utils'
// Styles
import s from './open-api-docs-demo.module.css'
import Accordion from 'components/accordion'

/**
 * Placeholder component to render an OpenAPI spec as UI.
 *
 * Aggregated tools that may be helpful:
 * - https://openapi.tools/
 *
 * Specific tools that may be helpful:
 * - https://github.com/readmeio/oas-normalize - parse out the spec, deref
 * - https://github.com/ErikWittern/openapi-snippet - generate snippets
 * - https://api.readme.dev/docs - just cool, not useful here
 */
function DisplaySection({ schemaFileString }: { schemaFileString: string }) {
	const parseResult = useMemo(() => {
		try {
			const schemaJson = JSON.parse(schemaFileString)
			const pathItemObjects = getPathItemObjects(schemaJson)
			const operationObjects = getOperationObjects(pathItemObjects)
			return { schemaJson, operationObjects, pathItemObjects }
		} catch (err) {
			return { error: err.message }
		}
	}, [schemaFileString])

	if (parseResult.error) {
		return (
			<div className={s.root}>
				<Text>Parsed JSON</Text>
				<DevCodeBlock>{JSON.stringify(parseResult, null, 2)}</DevCodeBlock>
			</div>
		)
	}

	const { schemaJson, operationObjects, pathItemObjects } = parseResult

	return (
		<div className={s.root}>
			<Text>Parsed JSON</Text>
			<DevCodeBlock>{JSON.stringify(schemaJson, null, 2)}</DevCodeBlock>
			<Text>Schema Info</Text>
			<DevCodeBlock>{JSON.stringify(schemaJson.info, null, 2)}</DevCodeBlock>
			<Text>Paths</Text>
			<DevCodeBlock>
				{JSON.stringify(
					pathItemObjects.map((p) => p.__path),
					null,
					2
				)}
			</DevCodeBlock>
			<Text>Operations</Text>
			{operationObjects.map((operation: $TSFixMe) => {
				const key = `${operation.__type}_${operation.__path}`
				return (
					<AccordionDisclosure title={key} key={key}>
						<DevCodeBlock>{JSON.stringify(operation, null, 2)}</DevCodeBlock>
					</AccordionDisclosure>
				)
			})}
		</div>
	)
}

/**
 * Render the input section and display section together.
 */
function OpenApiDocsDemoView() {
	const [fileString, setFileString] = useState('')
	return (
		<BaseNewLayout showFooterTopBorder>
			<InputSection fileString={fileString} setFileString={setFileString} />
			<DisplaySection schemaFileString={fileString} />
		</BaseNewLayout>
	)
}

export default OpenApiDocsDemoView

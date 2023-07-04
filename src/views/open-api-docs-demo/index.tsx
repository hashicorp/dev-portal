// Third-party
import { useState } from 'react'
// Layout
import BaseNewLayout from 'layouts/base-new'
// Local
import { InputControls } from './components'

/**
 * Placeholder component to render an OpenAPI spec as UI.
 */
function Display(props: Record<string, unknown>) {
	return (
		<>
			<pre style={{ margin: 0, border: '1px solid magenta' }}>
				<code>{JSON.stringify(props, null, 2)}</code>
			</pre>
		</>
	)
}

function OpenApiDocsDemoView() {
	const [fileString, setFileString] = useState('')
	return (
		<BaseNewLayout showFooterTopBorder>
			<InputControls setFileString={setFileString} />
			<Display
				view="OpenApiDocsDemoView"
				foo="bar"
				schemaFileString={fileString}
			/>
		</BaseNewLayout>
	)
}

export default OpenApiDocsDemoView

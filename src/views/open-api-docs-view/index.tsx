import type { OpenApiDocsViewProps } from './types'

/**
 * Placeholder for a revised OpenAPI docs view.
 */
function OpenApiDocsView(props: OpenApiDocsViewProps) {
	return (
		<div style={{ border: '1px solid magenta' }}>
			<h1>OpenApiDocsView Placeholder</h1>
			<pre>
				<code>{JSON.stringify(props, null, 2)}</code>
			</pre>
		</div>
	)
}

export default OpenApiDocsView

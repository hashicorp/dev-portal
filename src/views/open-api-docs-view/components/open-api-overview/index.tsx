import { DevCodeBlock } from '../dev-code-block'

/**
 * Render an overview section for an OpenApiView.
 */
export function OpenApiOverview({ _placeholder }: { _placeholder: $TSFixMe }) {
	return (
		<div style={{ border: '1px solid magenta' }}>
			<h1>{_placeholder.schemaData.info.title}</h1>
			<DevCodeBlock>{JSON.stringify(_placeholder, null, 2)}</DevCodeBlock>
		</div>
	)
}

// Local
import { DevCodeBlock } from '../components'
// Types
import type { OpenApiDocsViewProps } from 'views/open-api-docs-demo/types'
// Styles
import s from './open-api-docs-view.module.css'

/**
 * Placeholder for an Open API docs view.
 */
function OpenApiDocsView({ operationObjects, _schema }: OpenApiDocsViewProps) {
	return (
		<div className={s.root}>
			<div className={s.sidebar}>
				<ul>
					{operationObjects.map((o) => {
						return <li key={o.operationId}>{o.operationId}</li>
					})}
				</ul>
			</div>
			<div className={s.main}>
				<h3>Schema Info</h3>
				<DevCodeBlock>{JSON.stringify(_schema.info, null, 2)}</DevCodeBlock>
				{operationObjects.map((operation: $TSFixMe) => {
					const key = `${operation.__type}_${operation.__path}_${operation.operationId}`
					return (
						<div key={key}>
							<h3>{operation.operationId}</h3>
							<DevCodeBlock>{JSON.stringify(operation, null, 2)}</DevCodeBlock>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default OpenApiDocsView

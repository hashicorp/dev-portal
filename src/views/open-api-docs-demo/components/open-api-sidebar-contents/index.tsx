import { OperationProps } from 'views/open-api-docs-demo/types'
import s from './open-api-sidebar-contents.module.css'

export function OpenApiSidebarContents({
	operationObjects,
}: {
	operationObjects: OperationProps[]
}) {
	return (
		<div style={{ border: '1px solid magenta' }}>
			<ul className={s.listResetStyles}>
				<li>
					<a href={`#overview`}>Overview</a>
				</li>
				{operationObjects.map((o: OperationProps) => {
					return (
						<li key={o.operationId}>
							<a href={`#${o.slug}`}>{o.operationId}</a>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

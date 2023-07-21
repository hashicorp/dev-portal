import { OperationGroup, OperationProps } from 'views/open-api-docs-view/types'

/**
 * Renders sidebar contents for OpenApiDocsView.
 *
 * TODO: implement this component.
 * Designs show a list of navigational items
 * that link to the corresponding #operation-slug on the page.
 * We also want to highlight the current navigational item.
 *
 * Note: we likely also want to re-use this component to render
 * the OpenApiDocsView level of the corresponding mobile nav.
 */
export function OpenApiSidebarContents({
	operationGroups,
}: {
	operationGroups: OperationGroup[]
}) {
	return (
		<div style={{ border: '1px solid magenta', overflow: 'hidden' }}>
			{operationGroups.map((group) => {
				return (
					<>
						<div>{group.heading}</div>
						<ul key={group.heading}>
							{group.items.map((o: OperationProps) => {
								return (
									<li key={o.operationId}>
										<a href={`#${o.slug}`}>{o.operationId}</a>
									</li>
								)
							})}
						</ul>
					</>
				)
			})}
		</div>
	)
}

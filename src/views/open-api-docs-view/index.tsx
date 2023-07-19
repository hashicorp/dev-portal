// Layout
import SidebarLayout from 'layouts/sidebar-layout'
// Local
import { OpenApiDocsMobileMenuLevels } from './components'
import { DevCodeBlock, OperationSections } from './components'
// Types
import type { OpenApiDocsViewProps, OperationProps } from './types'

/**
 * Placeholder for a revised OpenAPI docs view.
 */
function OpenApiDocsView({
	productData,
	operationGroups,
	...restProps
}: OpenApiDocsViewProps) {
	return (
		<SidebarLayout
			sidebarSlot={
				<div style={{ border: '1px solid magenta', overflow: 'hidden' }}>
					{/**
					 *
					 * Placeholder for sidebar (and mobile nav?) contents
					 *
					 **/}
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
			}
			mobileMenuSlot={<OpenApiDocsMobileMenuLevels productData={productData} />}
		>
			{/**
			 *
			 * Placeholder for overview
			 *
			 **/}
			<div style={{ border: '1px solid magenta' }}>
				<h1>{restProps._placeholder.schemaData.info.title}</h1>
				<DevCodeBlock>{JSON.stringify(restProps, null, 2)}</DevCodeBlock>
			</div>

			<br />

			{/**
			 *
			 * Placeholder for operations
			 *
			 **/}
			<div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
				{operationGroups
					.map((group) => group.items)
					.flat()
					.map((o: OperationProps) => {
						return (
							<div
								key={o.operationId}
								style={{ border: '1px solid magenta', padding: '2px' }}
							>
								<div style={{ border: '1px solid magenta' }}>
									<h3 id={o.slug} className="g-offset-scroll-margin-top">
										{o.operationId}
									</h3>
								</div>
								<OperationSections
									examplesSlot={
										<div style={{ border: '1px solid magenta' }}>
											Examples{' '}
											<DevCodeBlock>{JSON.stringify(o, null, 2)}</DevCodeBlock>
										</div>
									}
									detailsSlot={
										<div style={{ border: '1px solid magenta' }}>
											Details
											<DevCodeBlock style={{ maxHeight: '500px' }}>
												{JSON.stringify(o, null, 2)}
											</DevCodeBlock>
										</div>
									}
								/>
							</div>
						)
					})}
			</div>
		</SidebarLayout>
	)
}

export default OpenApiDocsView

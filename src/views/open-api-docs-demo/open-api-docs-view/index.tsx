// Local
import { DevCodeBlock, OpenApiSidebarContents, Parameter } from '../components'
// Types
import type {
	OpenApiDocsViewProps,
	OperationProps,
	ParameterProps,
} from 'views/open-api-docs-demo/types'
// Styles
import s from './open-api-docs-view.module.css'
import { MdxHeadingOutsideMdx } from 'views/product-integration/component-view/components/mdx-heading-outside-mdx'
import CodeBlock from '@hashicorp/react-code-block'
import Text from 'components/text'
import Badge from 'components/badge'
import { truncateHcpOperationPath } from '../utils'
import SidebarBackToLink from 'components/sidebar/components/sidebar-back-to-link'

function ParametersSection({
	heading,
	parameters,
}: {
	heading: string
	parameters: ParameterProps[]
}) {
	return (
		<>
			<div>{heading}</div>
			<div>
				{parameters.map((p) => {
					return <Parameter key={p.name} name={p.name} />
				})}
			</div>
		</>
	)
}

/**
 * Placeholder for an Open API docs view.
 */
function OpenApiDocsView({ operationGroups, _schema }: OpenApiDocsViewProps) {
	return (
		<div className={s.root}>
			<div className={s.sidebar}>
				<SidebarBackToLink text="HashiCorp Cloud Platform" href="/hcp" />
				<OpenApiSidebarContents operationGroups={operationGroups} />
			</div>
			<div className={s.main}>
				<MdxHeadingOutsideMdx id="overview" level={3} title="Overview" />
				<DevCodeBlock>{JSON.stringify(_schema.info, null, 2)}</DevCodeBlock>
				{operationGroups
					.map((group) => group.items)
					.flat()
					.map((o: OperationProps) => {
						const key = `${_schema.info.title}_${_schema.info.version}_${o.operationId}`
						const truncatedPath = truncateHcpOperationPath(o._data.__path)
						return (
							<div key={key}>
								<MdxHeadingOutsideMdx
									id={o.slug}
									level={3}
									title={o.operationId}
								/>
								<div className={s.operationColumns}>
									<div className={s.operationCodeColumn}>
										<div className={s.methodAndPath}>
											<Badge text={o._data.__type.toUpperCase()} />
											<CodeBlock
												options={{
													showClipboard: true,
												}}
												className={s.codePlaceholder}
												// Insert <wbr/> to allow line breaks in the path
												code={truncatedPath.replace(/([^<])\//g, '$1/<wbr/>')}
											/>
										</div>
										{truncatedPath !== o._data.__path ? (
											<>
												{' '}
												<br />
												<DevCodeBlock className={s.propertiesPlaceholder}>
													Note: full path is <strong>{o._data.__path}</strong>.
													Has been truncated for clarity.
												</DevCodeBlock>
											</>
										) : null}
									</div>
									<div className={s.operationPropertiesColumn}>
										{o.summary ? <Text>{o.summary}</Text> : null}
										{o.pathParameters?.length > 0 ? (
											<ParametersSection
												heading="Path Parameters"
												parameters={o.pathParameters}
											/>
										) : null}
										{o.queryParameters?.length > 0 ? (
											<ParametersSection
												heading="Query Parameters"
												parameters={o.queryParameters}
											/>
										) : null}
										{o.bodyParameters?.length > 0 ? (
											<ParametersSection
												heading="Body Parameters"
												parameters={o.bodyParameters}
											/>
										) : null}
										<div>Responses</div>
										<DevCodeBlock className={s.propertiesPlaceholder}>
											{JSON.stringify(o._data.responses, null, 2)}
										</DevCodeBlock>
									</div>
								</div>
							</div>
						)
					})}
			</div>
		</div>
	)
}

export default OpenApiDocsView

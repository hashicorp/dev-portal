// Local
import { DevCodeBlock, OpenApiSidebarContents } from '../components'
// Types
import type {
	OpenApiDocsViewProps,
	OperationProps,
} from 'views/open-api-docs-demo/types'
// Styles
import s from './open-api-docs-view.module.css'
import { MdxHeadingOutsideMdx } from 'views/product-integration/component-view/components/mdx-heading-outside-mdx'
import CodeBlock from '@hashicorp/react-code-block'
import Text from 'components/text'
import Badge from 'components/badge'
import { truncateHcpOperationPath } from '../utils'

/**
 * Placeholder for an Open API docs view.
 */
function OpenApiDocsView({ operationObjects, _schema }: OpenApiDocsViewProps) {
	return (
		<div className={s.root}>
			<div className={s.sidebar}>
				<OpenApiSidebarContents operationObjects={operationObjects} />
			</div>
			<div className={s.main}>
				<MdxHeadingOutsideMdx id="overview" level={3} title="Overview" />
				<DevCodeBlock>{JSON.stringify(_schema.info, null, 2)}</DevCodeBlock>
				{operationObjects.map((o: OperationProps) => {
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
								<div className={s.operationPropertiesColumn}>
									{o.summary ? <Text>{o.summary}</Text> : null}
									<DevCodeBlock className={s.propertiesPlaceholder}>
										{JSON.stringify(o, null, 2)}
									</DevCodeBlock>
								</div>
								<div className={s.operationCodeColumn}>
									<div className={s.methodAndPath}>
										<Badge text={o._data.__type.toUpperCase()} />
										<CodeBlock
											options={{
												showClipboard: true,
											}}
											className={s.codePlaceholder}
											code={truncatedPath}
										/>
									</div>
									<br />
									<DevCodeBlock className={s.propertiesPlaceholder}>
										Note: full path is <strong>{o._data.__path}</strong>. Has
										been truncated for clarity.
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

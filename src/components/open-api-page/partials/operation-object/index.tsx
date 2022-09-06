import Tabs, { Tab } from 'components/tabs'
import AccordionDisclosure from 'components/accordion-disclosure'
import ResponseObject from '../response-object'
import Parameter from '../parameter'
import { capitalCase } from 'change-case'
import getBodyParamProps from './get-body-param-props'
import classNames from 'classnames'
import s from './style.module.css'
import { OperationObjectType } from '../../types'
import { MdxInlineCode } from 'components/dev-dot-content/mdx-components'
import Card from 'components/card'

function Parameters({ title, params }) {
	return (
		<>
			<p className={s.columnSectionHeading}>{title}</p>
			{params.map((parameter, idx) => {
				return (
					<Parameter
						key={parameter.name}
						name={parameter.name}
						data={parameter}
						isFirstItem={idx === 0}
						isLastItem={idx === params.length - 1}
					/>
				)
			})}
		</>
	)
}

/** Displays [Operation Object](https://swagger.io/specification/v2/#operation-object) data to the user. */
export interface OperationObjectProps {
	/** The path to the endpoint where this operation is executed */
	path: string
	/** The HTTP verb */
	type: 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch'
	/** A subset of [Operation Object](https://swagger.io/specification/v2/#operation-object) relevant to the UI */
	data: OperationObjectType
	/** React node to render at the top of the collapsible area of the operation object */
	renderOperationIntro?: (
		props: Record<'data', OperationObjectType>
	) => React.ReactNode
}

function OperationObject({
	data,
	path,
	type,
	renderOperationIntro,
}: OperationObjectProps): React.ReactElement {
	const { operationId, parameters, responses, summary } = data
	const successResponse = responses['200']
	const title = capitalCase(operationId.split('_').pop()!)

	// Group parameter properties by type
	const pathParams = parameters.filter((p) => p.in === 'path')
	const queryParams = parameters.filter((p) => p.in === 'query')
	const bodyParam = parameters.filter((p) => p.in === 'body')[0] // Note: we only accept a single "in=body" param
	const bodyProps = bodyParam ? getBodyParamProps(bodyParam) : []

	return (
		<div className={classNames(s.root)}>
			<AccordionDisclosure
				title={title}
				description={
					<span className={s.meta}>
						<span className={s.endpoint}>
							<MdxInlineCode className={s.method}>
								{type.toUpperCase()}
							</MdxInlineCode>
							<MdxInlineCode className={s.method}>{path}</MdxInlineCode>
						</span>
					</span>
				}
			>
				<hr />
				<div>
					{renderOperationIntro ? renderOperationIntro({ data }) : null}
					<div
						className={s.summary}
						dangerouslySetInnerHTML={{ __html: summary ?? '' }}
					/>
					<Tabs showAnchorLine={false}>
						<Tab heading="Request">
							<span className={s.spacer} />
							<Card elevation="base">
								{pathParams.length > 0 ? (
									<Parameters title="Path Parameters" params={pathParams} />
								) : null}
								{queryParams.length > 0 ? (
									<Parameters title="Query Parameters" params={queryParams} />
								) : null}
								{bodyProps.length > 0 ? (
									<Parameters title="Body Parameters" params={bodyProps} />
								) : null}
							</Card>
						</Tab>

						<Tab heading="Response">
							<span className={s.spacer} />
							<Card elevation="base">
								{successResponse ? (
									<>
										<p className={s.columnSectionHeading}>
											Successful Response
										</p>
										<ResponseObject data={successResponse} />
									</>
								) : (
									<p>No response has been defined.</p>
								)}
							</Card>
						</Tab>
					</Tabs>
				</div>
			</AccordionDisclosure>
		</div>
	)
}

export default OperationObject

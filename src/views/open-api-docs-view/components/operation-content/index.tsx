/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Components
import Badge from 'components/badge'
// Local components
import { OperationSections } from '../operation-sections'
import { OperationExamples } from '../operation-examples'
import { OperationDetails } from '../operation-details'
// Types
import type { PropertyDetailsSectionProps } from '../operation-details'
import type { ReactNode } from 'react'
// Styles
import s from './style.module.css'

export interface OperationContentProps {
	title: string
	tags: string[]
	slug: string
	type: string
	path: {
		full: string
		truncated: string
	}
	requestData: PropertyDetailsSectionProps
	responseData: PropertyDetailsSectionProps
	summary?: string
	/**
	 * Syntax-highlighted HTML that represents the URL path, with
	 * word breaks to allow long URLs to wrap to multiple lines.
	 */
	urlPathForCodeBlock: string
	versionSwitcherSlot?: ReactNode
}

/**
 * Operations are specific request types to specific endpoints.
 * They form the basis of OpenAPI docs pages.
 */
export interface OperationProps {
	slug: string
	type: string
}

/**
 * Render detailed content for an individual operation.
 */
export default function OperationContent({
	title,
	type,
	path,
	urlPathForCodeBlock,
	requestData,
	responseData,
	versionSwitcherSlot,
}: OperationContentProps) {
	return (
		<>
			<div className={s.header}>
				<h1 className={s.heading}>{title}</h1>
				{versionSwitcherSlot ? (
					<div className={s.versionSwitcherSlot}>{versionSwitcherSlot}</div>
				) : null}
			</div>
			<OperationSections
				headerSlot={
					<div className={s.methodAndPath}>
						<Badge className={s.method} type="outlined" text={type} />
						<p className={s.path}>{path.truncated}</p>
					</div>
				}
				examplesSlot={
					<OperationExamples heading={title} code={urlPathForCodeBlock} />
				}
				detailsSlot={
					<OperationDetails
						requestData={requestData}
						responseData={responseData}
					/>
				}
			/>
		</>
	)
}

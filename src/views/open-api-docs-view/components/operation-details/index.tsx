/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { PropertyDetails, PropertyDetailsProps } from '../property-details'
import type { OperationProps } from 'views/open-api-docs-view/types'
import s from './operation-details.module.css'

/**
 * TODO: implement this presentation component.
 */
export function OperationDetails({
	requestData,
	responseData,
}: {
	operation: OperationProps
	requestData: { heading: string; propertyDetails: PropertyDetailsProps[] }[]
	responseData: { heading: string; propertyDetails: PropertyDetailsProps[] }[]
}) {
	return (
		<div className={s.root}>
			<DetailsSection
				heading="Request"
				items={requestData}
				noItemsMessage="No request data."
			/>
			<DetailsSection
				heading="Response"
				items={responseData}
				noItemsMessage="No response data."
			/>
		</div>
	)
}

/**
 * TODO: add description
 */
function DetailsSection({
	heading,
	items,
	noItemsMessage,
}: {
	heading: string
	items: { heading: string; propertyDetails: PropertyDetailsProps[] }[]
	noItemsMessage: string
}) {
	return (
		<div className={s.detailsSection}>
			<div className={s.detailsHeading}>{heading}</div>
			{items.length > 0 ? (
				<div className={s.detailsSectionContent}>
					{items.map((item) => {
						return (
							<div className={s.detailsSubsection} key={item.heading}>
								<div className={s.detailsSubheading}>{item.heading}</div>
								<div className={s.detailsProperties}>
									{item.propertyDetails.map((property) => {
										return <PropertyDetails key={property.name} {...property} />
									})}
								</div>
							</div>
						)
					})}
				</div>
			) : (
				<div className={s.detailsNoItems}>{noItemsMessage}</div>
			)}
		</div>
	)
}

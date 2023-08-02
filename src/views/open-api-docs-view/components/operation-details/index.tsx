/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { PropertyDetails, PropertyDetailsProps } from '../property-details'
import s from './operation-details.module.css'

/**
 * Render request and response data for an operation.
 */
export function OperationDetails({
	requestData,
	responseData,
}: {
	requestData: { heading: string; propertyDetails: PropertyDetailsProps[] }[]
	responseData: { heading: string; propertyDetails: PropertyDetailsProps[] }[]
}) {
	return (
		<div className={s.root}>
			<PropertyDetailsSection
				heading="Request"
				groups={requestData}
				noGroupsMessage="No request data."
			/>
			<PropertyDetailsSection
				heading="Response"
				groups={responseData}
				noGroupsMessage="No response data."
			/>
		</div>
	)
}

/**
 * Render a section with many groups of property details.
 *
 * Used to show request and response details for operations
 */
function PropertyDetailsSection({
	heading,
	groups,
	noGroupsMessage,
}: {
	heading: string
	groups: { heading: string; propertyDetails: PropertyDetailsProps[] }[]
	noGroupsMessage: string
}) {
	return (
		<div className={s.section}>
			<div className={s.sectionHeading}>{heading}</div>
			{groups.length > 0 ? (
				<div className={s.sectionGroups}>
					{groups.map((group) => {
						return (
							<div className={s.group} key={group.heading}>
								<div className={s.groupHeading}>{group.heading}</div>
								<div className={s.groupProperties}>
									{group.propertyDetails.map((property) => {
										return <PropertyDetails key={property.name} {...property} />
									})}
								</div>
							</div>
						)
					})}
				</div>
			) : (
				<div className={s.noGroupsMessage}>{noGroupsMessage}</div>
			)}
		</div>
	)
}
